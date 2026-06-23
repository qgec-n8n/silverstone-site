import { useEffect, useRef, useState } from "react";

import "~/styles/visual/visual.css";

/*
  RAW WebGL signal field (no three.js, no dependencies). This is the lazy
  default export consumed by `createLazyVisual`, so its payload only enters the
  bundle on Tier A. The static poster is always rendered beneath it; on init
  failure or context loss this component renders nothing and the poster shows.

  Hard constraints honoured: DPR capped at 1.5, rAF paused on hidden tab /
  offscreen stage, context-loss leaves the poster visible, a single full-screen
  triangle with two cheap trig lobes for a sub-millisecond draw.
*/

const VERTEX_SRC = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;

vec3 platinum = vec3(0.945, 0.949, 0.961);
vec3 graphite = vec3(0.125, 0.165, 0.184);
vec3 cyan     = vec3(0.369, 0.773, 0.816);
vec3 violet   = vec3(0.663, 0.486, 0.753);

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  float settle = smoothstep(1.05, -0.1, uv.y);
  vec3 color = mix(platinum * 0.97, platinum, settle);

  vec2 c1 = vec2(0.74 + 0.03 * sin(uTime * 0.18), 0.30 + 0.02 * cos(uTime * 0.15));
  float lobe1 = smoothstep(0.42, 0.0, distance(uv, c1)) * 0.16;
  color += cyan * lobe1;

  vec2 c2 = vec2(0.18 + 0.025 * cos(uTime * 0.12), 0.84 + 0.02 * sin(uTime * 0.1));
  float lobe2 = smoothstep(0.5, 0.0, distance(uv, c2)) * 0.1;
  color += violet * lobe2;

  color += 0.012 * sin(uv.y * 220.0 + uTime * 0.2);

  float vig = smoothstep(1.25, 0.2, distance(uv, vec2(0.5)));
  color = mix(graphite, color, clamp(vig + 0.35, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
`;

const DPR_CAP = 1.5;

type FieldController = {
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const status: unknown = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (status !== true) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createSignalField(canvas: HTMLCanvasElement): FieldController | null {
  const context = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!context) {
    return null;
  }

  // Bind to a non-nullable const so the narrowing survives into the rAF
  // closures below (TS widens a nullable union back inside nested functions).
  const gl = context;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const linkStatus: unknown = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (linkStatus !== true) {
    gl.deleteProgram(program);
    return null;
  }

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uResolution = gl.getUniformLocation(program, "uResolution");
  const uTime = gl.getUniformLocation(program, "uTime");

  let raf = 0;
  let running = false;
  let startTime = 0;

  function resize() {
    const dpr = Math.min(Math.max(1, window.devicePixelRatio), DPR_CAP);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function frame(now: number) {
    if (!running) {
      return;
    }
    if (!startTime) {
      startTime = now;
    }
    resize();
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - startTime) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = window.requestAnimationFrame(frame);
  }

  function start() {
    if (running) {
      return;
    }
    running = true;
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) {
      window.cancelAnimationFrame(raf);
    }
    raf = 0;
  }

  function dispose() {
    stop();
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteBuffer(buffer);
  }

  return { start, stop, dispose };
}

export default function SignalFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const field = createSignalField(canvas);
    if (!field) {
      setFailed(true);
      return;
    }

    let tabVisible = !document.hidden;
    let onScreen = true;

    const sync = () => {
      if (tabVisible && onScreen) {
        field.start();
      } else {
        field.stop();
      }
    };

    const onVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      field.stop();
      setFailed(true);
    };

    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) {
            onScreen = entry.isIntersecting;
            sync();
          }
        },
        { threshold: 0.01 },
      );
      observer.observe(canvas);
    }

    sync();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (observer) {
        observer.disconnect();
      }
      field.dispose();
    };
  }, []);

  if (failed) {
    return null;
  }

  return <canvas ref={canvasRef} className="ss-stage__canvas" aria-hidden="true" />;
}
