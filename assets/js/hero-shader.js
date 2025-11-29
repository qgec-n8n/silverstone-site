// assets/js/hero-shader.js
// Implements WebGL background shader for index.html hero

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-shader-canvas');
    if (!canvas) return;

    // Reduced Motion Check
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.warn('WebGL not supported.');
        return;
    }

    // --- SHADER SOURCES ---
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform vec2 iResolution;
        uniform float iTime;

        // Configuration
        const float lineFrequency = 10.0;
        const float lineAmplitude = 0.05;
        const float lineSpeed = 0.5;
        const float warpFrequency = 5.0;
        const float warpAmplitude = 0.05;
        const float warpSpeed = 0.2;
        const vec4 lineColor = vec4(0.2, 0.8, 1.0, 1.0); // Cyan-ish
        const int linesPerGroup = 10;
        const float scale = 1.0;

        const float majorLineWidth = 0.01;
        const float minorLineWidth = 0.005;
        const float majorLineFrequency = 5.0;
        const float minorLineFrequency = 1.0;

        const float minLineWidth = 0.002;
        const float maxLineWidth = 0.015;
        const float minOffsetSpread = 0.05;
        const float maxOffsetSpread = 0.2;
        const float offsetSpeed = 0.2;
        const float offsetFrequency = 2.0;

        float drawSmoothLine(float pos, float halfWidth, float axis) {
            return smoothstep(halfWidth, 0.0, abs(axis - pos));
        }

        float drawCrispLine(float pos, float halfWidth, float axis) {
            return step(abs(axis - pos), halfWidth);
        }

        float drawPeriodicLine(float frequency, float width, float axis) {
            float t = axis * frequency;
            float dist = abs(fract(t + 0.5) - 0.5) / frequency;
            return drawSmoothLine(0.0, width, dist);
        }

        float drawCircle(vec2 pos, float radius, vec2 uv) {
            return 1.0 - smoothstep(radius, radius + 0.005, length(uv - pos));
        }

        float drawGridLines(float axis) {
             return drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
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
            // Aspect correct
            vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

            float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
            float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

            space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
            space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

            vec4 lines = vec4(0.0);
            vec4 bgColor1 = vec4(0.1, 0.1, 0.3, 1.0);
            vec4 bgColor2 = vec4(0.3, 0.1, 0.5, 1.0);

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
                lines += line * lineColor * rand;
            }

            fragColor = mix(bgColor1, bgColor2, uv.x);
            fragColor *= verticalFade;
            fragColor.a = 1.0;
            fragColor += lines;

            gl_FragColor = fragColor;
        }
    `;

    // --- SETUP ---
    const loadShader = (gl, type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error: ', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const initShaderProgram = (gl, vsSource, fsSource) => {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program link error: ', gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    };

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
            time: gl.getUniformLocation(shaderProgram, 'iTime'),
        },
    };

    const resizeCanvas = () => {
        const parent = canvas.parentElement || document.body;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Loop
    let startTime = Date.now();
    const render = () => {
        const currentTime = (Date.now() - startTime) / 1000;
        gl.useProgram(programInfo.program);
        gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
        gl.uniform1f(programInfo.uniformLocations.time, currentTime);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
});
