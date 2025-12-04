// assets/js/hero-shader.js
(function () {
  'use strict';

  // --- CONFIGURATION ---
  const THEMES = {
    // Original (Purple)
    default: {
      line: [0.4, 0.2, 0.8, 1.0],
      bg1: [0.1, 0.1, 0.3, 1.0],
      bg2: [0.3, 0.1, 0.5, 1.0]
    },
    // Services (Cyan/Blue) - Matching #00AEEF
    blue: {
      line: [0.0, 0.68, 0.94, 1.0],
      bg1: [0.0, 0.05, 0.2, 1.0],
      bg2: [0.0, 0.2, 0.4, 1.0]
    },
    // About (Green) - Matching #00FF9D
    green: {
      line: [0.0, 1.0, 0.62, 1.0],
      bg1: [0.0, 0.2, 0.1, 1.0],
      bg2: [0.0, 0.4, 0.2, 1.0]
    },
    // Book (Deep Amber/Orange - "Gold")
    // Adjusted to ensure contrast with white text is acceptable
    // Using a dark base with gold highlights
    amber: {
      line: [1.0, 0.65, 0.0, 1.0],
      bg1: [0.15, 0.05, 0.0, 1.0],
      bg2: [0.3, 0.1, 0.0, 1.0]
    },
    // Contact (Silver/Slate) - Matching #C0C0C0
    silver: {
      line: [0.75, 0.75, 0.75, 1.0],
      bg1: [0.1, 0.1, 0.1, 1.0],
      bg2: [0.25, 0.25, 0.25, 1.0]
    },
    // Niche pages – distinct hues per vertical
    violet: {
      line: [0.7, 0.45, 1.0, 1.0],
      bg1: [0.12, 0.05, 0.18, 1.0],
      bg2: [0.24, 0.12, 0.32, 1.0]
    },
    teal: {
      line: [0.15, 0.9, 0.78, 1.0],
      bg1: [0.03, 0.14, 0.12, 1.0],
      bg2: [0.08, 0.22, 0.2, 1.0]
    },
    rose: {
      line: [1.0, 0.45, 0.68, 1.0],
      bg1: [0.18, 0.06, 0.12, 1.0],
      bg2: [0.32, 0.12, 0.2, 1.0]
    },
    ember: {
      line: [1.0, 0.52, 0.2, 1.0],
      bg1: [0.14, 0.07, 0.02, 1.0],
      bg2: [0.28, 0.12, 0.05, 1.0]
    },
    aqua: {
      line: [0.25, 0.85, 1.0, 1.0],
      bg1: [0.05, 0.12, 0.18, 1.0],
      bg2: [0.1, 0.22, 0.32, 1.0]
    },
    emerald: {
      line: [0.2, 1.0, 0.7, 1.0],
      bg1: [0.06, 0.16, 0.12, 1.0],
      bg2: [0.12, 0.28, 0.2, 1.0]
    },
    ice: {
      line: [0.72, 0.9, 1.0, 1.0],
      bg1: [0.08, 0.12, 0.18, 1.0],
      bg2: [0.16, 0.22, 0.32, 1.0]
    },
    indigo: {
      line: [0.42, 0.42, 1.0, 1.0],
      bg1: [0.08, 0.08, 0.18, 1.0],
      bg2: [0.16, 0.16, 0.3, 1.0]
    },
    blush: {
      line: [1.0, 0.6, 0.85, 1.0],
      bg1: [0.18, 0.08, 0.16, 1.0],
      bg2: [0.32, 0.14, 0.26, 1.0]
    }
  };

  // Vertex shader source
  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  // Fragment shader source
  // Replaced const colors with uniforms: uLineColor, uBgColor1, uBgColor2
  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    // Theme colors passed as uniforms
    uniform vec4 uLineColor;
    uniform vec4 uBgColor1;
    uniform vec4 uBgColor2;

    const float overallSpeed = 0.2;
    const float gridSmoothWidth = 0.015;
    const float axisWidth = 0.05;
    const float majorLineWidth = 0.025;
    const float minorLineWidth = 0.0125;
    const float majorLineFrequency = 5.0;
    const float minorLineFrequency = 1.0;

    // gridColor was constant grey in original, keeping it constant
    const vec4 gridColor = vec4(0.5);

    const float scale = 5.0;
    // Removed fixed lineColor

    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.2;
    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.2;
    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;
    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;
    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;
    const int linesPerGroup = 16;

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
    #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

    float drawGridLines(float axis) {
      return drawCrispLine(0.0, axisWidth, axis)
            + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
            + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
    }

    float drawGrid(vec2 space) {
      return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
    }

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec4 fragColor;
      vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);

      // Use uniforms instead of constants
      vec4 bgColor1 = uBgColor1;
      vec4 bgColor2 = uBgColor2;

      for(int l = 0; l < linesPerGroup; l++) {
        float normalizedLineIndex = float(l) / float(linesPerGroup);
        float offsetTime = iTime * offsetSpeed;
        float offsetPosition = float(l) + space.x * offsetFrequency;
        float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
        float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
        float linePosition = getPlasmaY(space.x, horizontalFade, offset);
        float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

        float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

        line = line + circle;

        // Use uniform lineColor
        lines += line * uLineColor * rand;
      }

      fragColor = mix(bgColor1, bgColor2, uv.x);
      fragColor *= verticalFade;
      fragColor.a = 1.0;
      fragColor += lines;

      gl_FragColor = fragColor;
    }
  `;

  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader program link error:', gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  function initHeroShader() {
    const canvas = document.getElementById('hero-shader-canvas');
    if (!canvas) return;

    // Determine variant
    const variant = canvas.dataset.variant || 'default';
    const theme = THEMES[variant] || THEMES['default'];

    // Respect prefers-reduced-motion
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Leave fallback image visible; do not animate
      return;
    }

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported for hero shader.');
      return;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const attribLocations = {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    };
    const uniformLocations = {
      resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
      time: gl.getUniformLocation(shaderProgram, 'iTime'),
      uLineColor: gl.getUniformLocation(shaderProgram, 'uLineColor'),
      uBgColor1: gl.getUniformLocation(shaderProgram, 'uBgColor1'),
      uBgColor2: gl.getUniformLocation(shaderProgram, 'uBgColor2')
    };

    function resizeCanvas() {
      const hero = document.querySelector('.hero.title-band');
      const rect = hero ? hero.getBoundingClientRect() : canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let startTime = Date.now();
    let animationFrameId = null;

    function render() {
      const currentTime = (Date.now() - startTime) / 1000;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(shaderProgram);

      gl.uniform2f(uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniformLocations.time, currentTime);

      // Pass theme uniforms
      gl.uniform4fv(uniformLocations.uLineColor, theme.line);
      gl.uniform4fv(uniformLocations.uBgColor1, theme.bg1);
      gl.uniform4fv(uniformLocations.uBgColor2, theme.bg2);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(
        attribLocations.vertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(attribLocations.vertexPosition);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('beforeunload', function handleBeforeUnload() {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroShader);
  } else {
    initHeroShader();
  }
})();
