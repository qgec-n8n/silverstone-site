import { useEffect, useRef, useState } from "react";

import "~/styles/visual/home-v2.css";

/*
  Dark-native raw WebGL hero field (no three.js, no dependencies). Loaded lazily
  via `createLazyVisual`, so its payload only enters the bundle on the full tier
  once the browser is idle. The static poster is always rendered beneath it; on
  init failure or context loss this renders nothing and the poster shows.

  Constraints honoured: DPR capped at 1.5, rAF paused on hidden tab / offscreen
  stage, a single full-screen triangle with cheap trig lobes for a sub-ms draw.
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

vec3 voidBase = vec3(0.020, 0.027, 0.039);
vec3 cyan     = vec3(0.133, 0.827, 0.933);
vec3 violet   = vec3(0.663, 0.486, 0.753);
vec3 blue     = vec3(0.349, 0.498, 0.678);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec3 color = voidBase;

  vec2 c1 = vec2(0.74 + 0.05 * sin(uTime * 0.12), 0.30 + 0.04 * cos(uTime * 0.10));
  float lobe1 = smoothstep(0.55, 0.0, distance(uv, c1));
  color += cyan * lobe1 * lobe1 * 0.22;

  vec2 c2 = vec2(0.18 + 0.04 * cos(uTime * 0.09), 0.78 + 0.03 * sin(uTime * 0.08));
  float lobe2 = smoothstep(0.6, 0.0, distance(uv, c2));
  color += violet * lobe2 * lobe2 * 0.18;

  vec2 c3 = vec2(0.5 + 0.06 * sin(uTime * 0.07), 0.5);
  float lobe3 = smoothstep(0.78, 0.0, distance(uv, c3));
  color += blue * lobe3 * lobe3 * 0.06;

  color += cyan * 0.014 * sin(uv.y * 180.0 + uTime * 0.6) * smoothstep(0.0, 0.5, lobe1);
  color += (hash(uv * uResolution.xy * 0.5 + uTime) - 0.5) * 0.015;

  float vig = smoothstep(1.25, 0.25, distance(uv, vec2(0.5)));
  color *= mix(0.55, 1.0, vig);

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

function createHeroField(canvas: HTMLCanvasElement): FieldController | null {
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
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

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

export default function HeroFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const field = createHeroField(canvas);
    if (!field) {
      setFailed(true);
      return undefined;
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

  return <canvas ref={canvasRef} className="ss-hv2-hero__canvas" aria-hidden="true" />;
}
