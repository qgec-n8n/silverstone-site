/**
 * Every content image on the site opens into a lightbox.
 *
 * `ExpandableImage` wraps a `<picture>`/`<img>` in a frame that carries the
 * cue — four corner brackets and a small glass chip reading "Expand". The chip
 * is the control: only it opens the lightbox (the picture itself is inert, so
 * a click or tap on the image never lifts it), and on activation it brings the
 * image forward as a Radix dialog: focus trap, Escape, scrim click, scroll
 * lock, focus return. The image morphs out of its own frame on the page and
 * back into it on close (Motion shared layout), solid from the first frame;
 * the scrim darkens as it lifts.
 *
 * The morph's socket is an invisible ghost inside the frame that carries the
 * shared `layoutId` — never the image itself, which shared layout would hide
 * and leave a hole in the page. Where the page shows a crop (`object-fit:
 * cover` at a fixed aspect), the ghost is fitted to the largest box of the
 * full image's aspect inside the crop, so the lift is always a uniform scale
 * and the picture never stretches. The ghost is re-fitted one commit *before*
 * the dialog mounts and its `layoutDependency` flips *with* the mount, which
 * is exactly when Motion snapshots the follower's box for the morph.
 *
 * The portal leaves every scoped stylesheet, so the lightbox is styled from
 * the global tokens (`~/styles/image-lightbox.css`) and carries the route's
 * accent across as `--lb-accent`, read from the frame at open time.
 */
import { AnimatePresence, useReducedMotion, type MotionStyle } from "motion/react";
import * as m from "motion/react-m";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";

import { Maximize2, X } from "~/components/icons/lucide";
import { cn } from "~/lib/utils";

/* The opened frame's radius, handed to Motion as a value so the morph
   scale-corrects the corners rather than stretching them with the box.
   Matches `.ss-lightbox__frame` in the stylesheet. */
const FRAME_RADIUS = 20;
const morph = { type: "spring", stiffness: 290, damping: 33, mass: 0.9 } as const;
const entranceEase = [0.22, 1, 0.36, 1] as const;

/** The ghost's box inside the frame, in px. `null` fills the frame. */
type Socket = { left: number; top: number; width: number; height: number };

type Frame = {
  src: string;
  /** width ÷ height of the full image. */
  ratio: number;
  accent: CSSProperties;
};

const CORNERS = ["nw", "ne", "sw", "se"] as const;

/** The first non-empty string, for sources that report "" before they load. */
function firstOf(...candidates: string[]): string {
  return candidates.find((candidate) => candidate !== "") ?? "";
}

/**
 * The largest box of `ratio` that fits inside `box`, centred: where the page
 * crops the image, the lightbox grows out of the part of it that shows the
 * whole picture at the same scale.
 */
function fitSocket(box: DOMRect, origin: DOMRect, ratio: number): Socket {
  let width = box.width;
  let height = box.height;
  if (box.height > 0 && ratio > box.width / box.height) {
    height = width / ratio;
  } else {
    width = height * ratio;
  }
  return {
    left: box.left - origin.left + (box.width - width) / 2,
    top: box.top - origin.top + (box.height - height) / 2,
    width,
    height,
  };
}

export function ExpandableImage({
  alt,
  caption,
  children,
  className,
  height,
  src,
  width,
}: {
  /** The image's alt: names the control and captions the opened image. */
  alt: string;
  /** Caption under the opened image; defaults to `alt`. */
  caption?: string;
  /** The `<picture>` or `<img>` exactly as the page already renders it. */
  children: ReactNode;
  className?: string;
  /** Intrinsic size, used when the rendered image has not decoded yet. */
  height?: number;
  /** Source used when the rendered image reports no `currentSrc` yet. */
  src?: string;
  width?: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const id = useId();
  const layoutId = reducedMotion ? undefined : `${id}-image`;
  const frameRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const open = frame !== null;

  const expand = () => {
    const frame = frameRef.current;
    const image = frame?.querySelector("img");
    if (!frame || !image) {
      return;
    }
    const imageBox = image.getBoundingClientRect();
    const natural =
      image.naturalWidth > 0 && image.naturalHeight > 0
        ? image.naturalWidth / image.naturalHeight
        : width && height
          ? width / height
          : imageBox.height > 0
            ? imageBox.width / imageBox.height
            : 1;
    /* Two commits on purpose (see the header): the ghost takes its fitted
       box in a flushed commit of its own, then the dialog mounts and the
       ghost's `layoutDependency` flips with it. */
    flushSync(() => {
      setSocket(fitSocket(imageBox, frame.getBoundingClientRect(), natural));
    });

    const style = getComputedStyle(frame);
    const accent = firstOf(
      style.getPropertyValue("--srv2-accent").trim(),
      style.getPropertyValue("--ss-v2-signal-cyan").trim(),
    );
    setFrame({
      // `currentSrc` is what the picture is showing right now (the mobile
      // crop on a phone), so the lift never swaps sources mid-morph.
      src: firstOf(image.currentSrc, image.src, src ?? ""),
      ratio: natural,
      accent: accent ? ({ "--lb-accent": accent } as CSSProperties) : {},
    });
  };

  const ghostStyle: MotionStyle = socket
    ? {
        left: socket.left,
        top: socket.top,
        width: socket.width,
        height: socket.height,
        borderRadius: FRAME_RADIUS,
      }
    : { left: 0, top: 0, width: "100%", height: "100%", borderRadius: FRAME_RADIUS };

  return (
    <>
      <div
        className={cn("ss-zoom", className)}
        data-state={open ? "open" : "closed"}
        ref={frameRef}
      >
        {children}
        {layoutId ? (
          <m.span
            aria-hidden="true"
            className="ss-zoom__ghost"
            layoutDependency={open}
            layoutId={layoutId}
            style={ghostStyle}
            transition={morph}
          />
        ) : null}
        {CORNERS.map((corner) => (
          <span
            aria-hidden="true"
            className="ss-zoom__corner"
            data-at={corner}
            key={corner}
          />
        ))}
        {/* The chip is the only control — the picture beside it opens
            nothing. The button's padding is an invisible hit area around
            the chip, so the finger target is generous while the chip itself
            stays a small instrument. */}
        <button
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`Expand image: ${alt}`}
          className="ss-zoom__button"
          onClick={expand}
          ref={buttonRef}
          type="button"
        >
          <span aria-hidden="true" className="ss-zoom__cue">
            <Maximize2 aria-hidden="true" />
            <span>Expand</span>
          </span>
        </button>
      </div>

      <DialogPrimitive.Root
        onOpenChange={(next) => {
          if (!next) {
            setFrame(null);
          }
        }}
        open={open}
      >
        <AnimatePresence>
          {frame ? (
            <ImageLightbox
              alt={alt}
              caption={caption ?? alt}
              frame={frame}
              key="lightbox"
              layoutId={layoutId}
              onCloseAutoFocus={() => {
                buttonRef.current?.focus({ preventScroll: true });
              }}
              reducedMotion={reducedMotion}
            />
          ) : null}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </>
  );
}

function ImageLightbox({
  alt,
  caption,
  frame,
  layoutId,
  onCloseAutoFocus,
  reducedMotion,
}: {
  alt: string;
  caption: string;
  frame: Frame;
  layoutId: string | undefined;
  onCloseAutoFocus: () => void;
  reducedMotion: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const settle = reducedMotion
    ? { duration: 0 }
    : { delay: 0.18, duration: 0.4, ease: entranceEase };

  return (
    <DialogPrimitive.Portal forceMount>
      <div className="ss-lightbox" style={frame.accent}>
        <DialogPrimitive.Overlay asChild forceMount>
          <m.div
            animate={{ opacity: 1 }}
            className="ss-lightbox__scrim"
            exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          />
        </DialogPrimitive.Overlay>
        {/* The stage centres the panel and lets pointer events fall through
            to the scrim, so a click beside the image is an outside click. */}
        <div className="ss-lightbox__stage">
          <DialogPrimitive.Content
            aria-describedby={undefined}
            asChild
            forceMount
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              onCloseAutoFocus();
            }}
            onOpenAutoFocus={(event) => {
              // Land on the panel, not the close button: the first Tab then
              // reaches the close, and a pointer reader sees no ring.
              event.preventDefault();
              panelRef.current?.focus({ preventScroll: true });
            }}
          >
            <div className="ss-lightbox__panel" ref={panelRef} tabIndex={-1}>
              <m.figure
                className="ss-lightbox__frame"
                style={
                  {
                    "--lb-ratio": frame.ratio,
                    borderRadius: FRAME_RADIUS,
                  } as MotionStyle
                }
                transition={morph}
                {...(layoutId
                  ? {
                      layoutId,
                      /* Solid from its first frame: shared layout would
                         otherwise fade it up over the whole morph. The way
                         back belongs to the ghost, which keeps the default
                         crossfade and so projects this frame onto the page
                         image and fades it over the second half of the
                         return — a crossfade here would hide the frame the
                         instant it started leaving. */
                      layoutCrossfade: false,
                    }
                  : {
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, transition: { duration: 0.2 } },
                      initial: { opacity: reducedMotion ? 1 : 0, scale: 1 },
                    })}
              >
                <img alt={alt} className="ss-lightbox__image" src={frame.src} />
                <DialogPrimitive.Close asChild>
                  <m.button
                    animate={{ opacity: 1 }}
                    aria-label="Close"
                    className="ss-lightbox__close"
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    initial={{ opacity: reducedMotion ? 1 : 0 }}
                    transition={settle}
                    type="button"
                  >
                    <X aria-hidden="true" />
                  </m.button>
                </DialogPrimitive.Close>
              </m.figure>
              <DialogPrimitive.Title asChild>
                {/* Opacity only: a translate would draw the glyphs at
                    fractional offsets on the way in and then snap them
                    crisp, which reads as the caption changing colour. */}
                <m.p
                  animate={{ opacity: 1 }}
                  className="ss-lightbox__caption"
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  initial={reducedMotion ? false : { opacity: 0 }}
                  transition={settle}
                >
                  {caption}
                </m.p>
              </DialogPrimitive.Title>
            </div>
          </DialogPrimitive.Content>
        </div>
      </div>
    </DialogPrimitive.Portal>
  );
}
