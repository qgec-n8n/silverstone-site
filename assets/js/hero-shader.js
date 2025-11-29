/**
 * HERO SHADER: Neural Field Implementation
 * Ported from React/TS to Vanilla JS WebGL
 */
(function () {
    'use strict';

    class HeroShader {
        constructor() {
            this.canvas = document.getElementById('hero-canvas');
            if (!this.canvas) return;

            this.gl = this.canvas.getContext('webgl');
            if (!this.gl) {
                console.warn('WebGL not supported');
                return;
            }

            this.program = null;
            this.startTime = Date.now();
            this.rafId = null;

            this.init();
        }

        init() {
            // Vertex Shader
            const vsSource = `
                attribute vec4 aVertexPosition;
                void main() {
                    gl_Position = aVertexPosition;
                }
            `;

            // Fragment Shader (Ported from provided React component)
            const fsSource = `
                precision highp float;
                uniform vec2 iResolution;
                uniform float iTime;
                const float overallSpeed = 0.2;
                const float gridSmoothWidth = 0.015;
                const float axisWidth = 0.05;
                const float majorLineWidth = 0.025;
                const float minorLineWidth = 0.0125;
                const float majorLineFrequency = 5.0;
                const float minorLineFrequency = 1.0;
                const vec4 gridColor = vec4(0.5);
                const float scale = 5.0;
                const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
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

            this.program = this.initShaderProgram(vsSource, fsSource);
            if (!this.program) return;

            // Buffer Setup
            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            const positions = [
                -1.0, -1.0,
                1.0, -1.0,
                -1.0, 1.0,
                1.0, 1.0,
            ];
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

            this.programInfo = {
                program: this.program,
                attribLocations: {
                    vertexPosition: this.gl.getAttribLocation(this.program, 'aVertexPosition'),
                },
                uniformLocations: {
                    resolution: this.gl.getUniformLocation(this.program, 'iResolution'),
                    time: this.gl.getUniformLocation(this.program, 'iTime'),
                },
            };

            // Event Listeners
            this.resizeCanvas = this.resizeCanvas.bind(this);
            window.addEventListener('resize', this.resizeCanvas);
            this.resizeCanvas();

            this.render = this.render.bind(this);
            this.rafId = requestAnimationFrame(this.render);
        }

        initShaderProgram(vsSource, fsSource) {
            const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
            const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

            if (!vertexShader || !fragmentShader) return null;

            const shaderProgram = this.gl.createProgram();
            this.gl.attachShader(shaderProgram, vertexShader);
            this.gl.attachShader(shaderProgram, fragmentShader);
            this.gl.linkProgram(shaderProgram);

            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                console.error('Shader program link error: ', this.gl.getProgramInfoLog(shaderProgram));
                return null;
            }
            return shaderProgram;
        }

        loadShader(type, source) {
            const shader = this.gl.createShader(type);
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);

            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.error('Shader compile error: ', this.gl.getShaderInfoLog(shader));
                this.gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        resizeCanvas() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }

        render() {
            const currentTime = (Date.now() - this.startTime) / 1000;

            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            this.gl.useProgram(this.programInfo.program);
            this.gl.uniform2f(this.programInfo.uniformLocations.resolution, this.canvas.width, this.canvas.height);
            this.gl.uniform1f(this.programInfo.uniformLocations.time, currentTime);

            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
            this.gl.vertexAttribPointer(
                this.programInfo.attribLocations.vertexPosition,
                2,
                this.gl.FLOAT,
                false,
                0,
                0
            );

            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

            this.rafId = requestAnimationFrame(this.render);
        }
    }

    // Initialize on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new HeroShader());
    } else {
        new HeroShader();
    }
})();
