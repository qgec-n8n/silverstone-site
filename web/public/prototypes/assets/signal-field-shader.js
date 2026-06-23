/*
  Silverstone "Precision Luminescence" — deferred signal-field background.
  RAW WebGL (no three.js, no dependencies). Loaded only on Tier A and only
  via dynamic import, so its payload never enters the critical path.

  Design intent: a restrained, low-amplitude drift of platinum light with a
  faint cyan->violet signal bloom that sits BEHIND the visual stage. It is
  decoration, never content; text never sits on top of it. The static poster
  underneath is always the source of truth and the fallback.

  Hard constraints honoured here:
   - DPR capped at 1.5 to bound fill cost.
   - rAF paused by the host on hidden tab / offscreen stage.
   - Context-loss leaves the poster visible (host handles the event).
   - Single full-screen triangle, two cheap trig lobes — sub-millisecond draw.
*/

const VERTEX_SRC = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Calm, banded luminance + two slow signal lobes. Kept deliberately cheap.
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

  // Base vertical platinum settle (lighter at top).
  float settle = smoothstep(1.05, -0.1, uv.y);
  vec3 color = mix(platinum * 0.97, platinum, settle);

  // Slow drifting signal lobe (cyan) in the upper-right quadrant.
  vec2 c1 = vec2(0.74 + 0.03 * sin(uTime * 0.18), 0.30 + 0.02 * cos(uTime * 0.15));
  float d1 = distance(uv, c1);
  float lobe1 = smoothstep(0.42, 0.0, d1) * 0.16;
  color += cyan * lobe1;

  // Second, fainter violet lobe drifting toward the lower-left.
  vec2 c2 = vec2(0.18 + 0.025 * cos(uTime * 0.12), 0.84 + 0.02 * sin(uTime * 0.1));
  float d2 = distance(uv, c2);
  float lobe2 = smoothstep(0.5, 0.0, d2) * 0.1;
  color += violet * lobe2;

  // Very fine engineered banding (low amplitude) for "instrument" texture.
  float bands = 0.012 * sin(uv.y * 220.0 + uTime * 0.2);
  color += bands;

  // Subtle graphite vignette to seat the panel.
  float vig = smoothstep(1.25, 0.2, distance(uv, vec2(0.5)));
  color = mix(graphite, color, clamp(vig + 0.35, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createSignalField(canvas) {
  const gl =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    }) || null;

  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // Full-screen triangle (cheaper than a quad).
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

  const DPR_CAP = 1.5;
  let raf = 0;
  let running = false;
  let startTime = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function frame(now) {
    if (!running) return;
    if (!startTime) startTime = now;
    resize();
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - startTime) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = window.requestAnimationFrame(frame);
  }

  const onResize = () => resize();

  return {
    start() {
      if (running) return;
      running = true;
      window.addEventListener("resize", onResize, { passive: true });
      raf = window.requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("resize", onResize);
    },
    dispose() {
      this.stop();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    },
  };
}
