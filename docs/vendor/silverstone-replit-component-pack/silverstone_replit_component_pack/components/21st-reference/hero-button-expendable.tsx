"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, Check, Globe2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { GodRays, MeshGradient } from "@paper-design/shaders-react";

export default function HeroButtonExpendableReference() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formStep, setFormStep] = useState<"idle" | "submitting" | "success">("idle");

  const handleClose = () => {
    setIsExpanded(false);
    window.setTimeout(() => setFormStep("idle"), 500);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormStep("submitting");
    window.setTimeout(() => setFormStep("success"), 1500);
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = isExpanded ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isExpanded]);

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-12 transition-colors duration-300 dark:bg-zinc-950 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <GodRays
            colorBack="#00000000"
            colors={["#a1a1aa40", "#e4e4e740", "#71717a40", "#52525b40"]}
            colorBloom="#a1a1aa"
            offsetX={0.85}
            offsetY={-1}
            intensity={0.5}
            spotty={0.45}
            midSize={10}
            midIntensity={0}
            density={0.38}
            bloom={0.3}
            speed={0.5}
            scale={1.6}
            frame={3332042.8159981333}
            style={{ height: "100%", width: "100%", position: "absolute", inset: 0 }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center rounded-full border border-zinc-200 bg-white/50 px-3 py-1 text-sm font-medium text-zinc-800 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
            <span className="mr-2 size-2 rounded-full bg-blue-600" /> New: Q3 Enterprise Report
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="max-w-4xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl">
            Orchestrate your entire <span className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">revenue engine</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl px-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg md:text-xl">
            Stop wrestling with disconnected tools. This reference demonstrates an expanding shared-layout call to action.
          </motion.p>
          <AnimatePresence initial={false}>
            {!isExpanded && (
              <motion.div className="relative mt-4 inline-block">
                <motion.div style={{ borderRadius: 100 }} layout layoutId="cta-card" className="absolute inset-0 bg-blue-600" />
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setIsExpanded(true)} className="relative flex h-14 items-center gap-2 px-8 py-3 text-lg font-medium tracking-wide text-white transition-opacity hover:opacity-90">
                  Start your journey <ArrowRight className="size-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <motion.div layoutId="cta-card" transition={{ type: "spring", bounce: 0, duration: 0.4 }} style={{ borderRadius: 24 }} className="relative flex h-full w-full overflow-hidden bg-blue-700 shadow-2xl sm:rounded-3xl">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute inset-0">
                <MeshGradient speed={0.6} colors={["#1d4ed8", "#1e40af", "#172554", "#1e3a8a"]} distortion={0.8} swirl={0.1} grainMixer={0.15} grainOverlay={0} style={{ height: "100%", width: "100%" }} />
              </motion.div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleClose} aria-label="Close" className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-8 sm:top-8">
                <X className="size-5" />
              </motion.button>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }} className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
                <div className="flex flex-1 flex-col justify-center gap-8 p-8 text-white sm:p-12 lg:p-16">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">Ready to scale?</h2>
                    <p className="max-w-md text-lg text-blue-100">Reference copy only. Replace all claims, testimonials and form behaviour before use.</p>
                  </div>
                  <div className="space-y-6">
                    {[{ icon: BarChart3, title: "Analytics first" }, { icon: Globe2, title: "Global edge" }].map(({ icon: Icon, title }) => (
                      <div key={title} className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm"><Icon className="size-6 text-blue-200" /></div>
                        <div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-blue-100/80">Reference supporting copy.</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center bg-black/10 p-4 backdrop-blur-sm sm:p-12 lg:bg-transparent lg:p-16 lg:backdrop-blur-none">
                  <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
                    {formStep === "success" ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex h-[400px] flex-col items-center justify-center space-y-6 text-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30"><Check className="size-10 text-white" /></div>
                        <div><h3 className="mb-2 text-2xl font-bold text-white">Request received</h3><p className="text-blue-100">Reference state only.</p></div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div><h3 className="text-xl font-semibold text-white">Get a demo</h3><p className="text-sm text-blue-200">Reference form only.</p></div>
                        {[
                          { id: "name", label: "Full name", type: "text" },
                          { id: "email", label: "Work email", type: "email" },
                          { id: "company", label: "Company", type: "text" },
                        ].map((field) => (
                          <div key={field.id}><label htmlFor={field.id} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-blue-200">{field.label}</label><input required={field.id !== "company"} type={field.type} id={field.id} className="w-full rounded-lg border border-blue-300/20 bg-blue-950/40 px-4 py-3 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-blue-400" /></div>
                        ))}
                        <button disabled={formStep === "submitting"} type="submit" className="mt-2 flex w-full items-center justify-center rounded-lg bg-white px-8 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-70">
                          {formStep === "submitting" ? "Sending..." : "Submit request"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
