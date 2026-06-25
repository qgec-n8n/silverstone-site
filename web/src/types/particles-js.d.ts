/*
  particles.js (v2.0.0) is loaded at runtime as a classic <script> from its
  local bundled URL (`particles.js/particles.js?url`) rather than imported as an
  ES module. The library's internal `Object.deepExtend` uses `arguments.callee`,
  which throws under ES-module strict mode, so it must execute in sloppy mode.
  These globals describe the surface the classic script attaches to `window`.
*/

interface ParticlesPjsInstance {
  pJS: {
    fn: {
      vendors: {
        destroypJS: () => void;
        draw: () => void;
      };
    };
    drawAnimFrame?: number;
  };
}

interface Window {
  particlesJS?: (tagId: string, params: Record<string, unknown>) => void;
  pJSDom?: ParticlesPjsInstance[];
}
