class AdvancedGalaxy {
    constructor(options = {}) {
        this.options = {
            mouseRepulsion: options.mouseRepulsion !== false,
            mouseInteraction: options.mouseInteraction !== false,
            density: options.density || 1.5,
            glowIntensity: options.glowIntensity || 0.5,
            saturation: options.saturation || 0.8,
            hueShift: options.hueShift || 240,
            twinkleIntensity: options.twinkleIntensity || 0.5,
            rotationSpeed: options.rotationSpeed || 0.2,
            speed: options.speed || 1.0,
            repulsionStrength: options.repulsionStrength || 2,
            transparent: options.transparent !== false,
            ...options
        };

        this.mouse = { x: 0.5, y: 0.5 };
        this.mouseActive = 0.0;
        this.smoothMouse = { x: 0.5, y: 0.5 };
        this.smoothMouseActive = 0.0;
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.animateId = null;
        this.startTime = Date.now();

        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(this.canvas);

        // Initialize WebGL
        this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }

        // Set up WebGL context
        if (this.options.transparent) {
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.clearColor(0, 0, 0, 0);
        } else {
            this.gl.clearColor(0, 0, 0, 1);
        }

        this.    this.resize();
    this.createShaders();
    this.createGeometry();
    this.addEventListeners();
    this.animate();
    }

    resize() {
        const scale = 1;
        this.canvas.width = window.innerWidth * scale;
        this.canvas.height = window.innerHeight * scale;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.program) {
            this.gl.useProgram(this.program);
            const resolutionLocation = this.gl.getUniformLocation(this.program, 'uResolution');
            this.gl.uniform3f(resolutionLocation, this.canvas.width, this.canvas.height, this.canvas.width / this.canvas.height);
        }
    }

    createShaders() {
        const vertexShaderSource = `
            attribute vec2 position;
            attribute vec2 uv;
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            
            uniform float uTime;
            uniform vec3 uResolution;
            uniform vec2 uFocal;
            uniform vec2 uRotation;
            uniform float uStarSpeed;
            uniform float uDensity;
            uniform float uHueShift;
            uniform float uSpeed;
            uniform vec2 uMouse;
            uniform float uGlowIntensity;
            uniform float uSaturation;
            uniform bool uMouseRepulsion;
            uniform float uTwinkleIntensity;
            uniform float uRotationSpeed;
            uniform float uRepulsionStrength;
            uniform float uMouseActiveFactor;
            uniform float uAutoCenterRepulsion;
            uniform bool uTransparent;
            
            varying vec2 vUv;
            
            #define NUM_LAYER 4.0
            #define STAR_COLOR_CUTOFF 0.2
            #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
            #define PERIOD 3.0
            
            float Hash21(vec2 p) {
                p = fract(p * vec2(123.34, 456.21));
                p += dot(p, p + 45.32);
                return fract(p.x * p.y);
            }
            
            float tri(float x) {
                return abs(fract(x) * 2.0 - 1.0);
            }
            
            float tris(float x) {
                float t = fract(x);
                return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
            }
            
            float trisn(float x) {
                float t = fract(x);
                return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
            }
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            float Star(vec2 uv, float flare) {
                float d = length(uv);
                float m = (0.05 * uGlowIntensity) / d;
                float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
                m += rays * flare * uGlowIntensity;
                uv *= MAT45;
                rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
                m += rays * 0.3 * flare * uGlowIntensity;
                m *= smoothstep(1.0, 0.2, d);
                return m;
            }
            
            vec3 StarLayer(vec2 uv) {
                vec3 col = vec3(0.0);
                
                vec2 gv = fract(uv) - 0.5;
                vec2 id = floor(uv);
                
                for (int y = -1; y <= 1; y++) {
                    for (int x = -1; x <= 1; x++) {
                        vec2 offset = vec2(float(x), float(y));
                        vec2 si = id + vec2(float(x), float(y));
                        float seed = Hash21(si);
                        float size = fract(seed * 345.32);
                        float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
                        float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
                        
                        float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
                        float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
                        float grn = min(red, blu) * seed;
                        vec3 base = vec3(red, grn, blu);
                        
                        float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
                        hue = fract(hue + uHueShift / 360.0);
                        float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
                        float val = max(max(base.r, base.g), base.b);
                        base = hsv2rgb(vec3(hue, sat, val));
                        
                        vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
                        
                        float star = Star(gv - offset - pad, flareSize);
                        vec3 color = base;
                        
                        float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
                        twinkle = mix(1.0, twinkle, uTwinkleIntensity);
                        star *= twinkle;
                        
                        col += star * size * color;
                    }
                }
                
                return col;
            }
            
            void main() {
                vec2 focalPx = uFocal * uResolution.xy;
                vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
                
                vec2 mouseNorm = uMouse - vec2(0.5);
                
                if (uAutoCenterRepulsion > 0.0) {
                    vec2 centerUV = vec2(0.0, 0.0);
                    float centerDist = length(uv - centerUV);
                    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
                    uv += repulsion * 0.05;
                } else if (uMouseRepulsion) {
                    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
                    float mouseDist = length(uv - mousePosUV);
                    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
                    uv += repulsion * 0.05 * uMouseActiveFactor;
                } else {
                    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
                    uv += mouseOffset;
                }
                
                float autoRotAngle = uTime * uRotationSpeed;
                mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
                uv = autoRot * uv;
                
                uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
                
                vec3 col = vec3(0.0);
                
                for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
                    float depth = fract(i + uStarSpeed * uSpeed);
                    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
                    float fade = depth * smoothstep(1.0, 0.9, depth);
                    col += StarLayer(uv * scale + i * 453.32) * fade;
                }
                
                if (uTransparent) {
                    float alpha = length(col);
                    alpha = smoothstep(0.0, 0.3, alpha);
                    alpha = min(alpha, 1.0);
                    gl_FragColor = vec4(col, alpha);
                } else {
                    gl_FragColor = vec4(col, 1.0);
                }
            }
        `;

        // Create shaders
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Create program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
            return;
        }

        this.gl.useProgram(this.program);
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    createGeometry() {
        // Create a simple quad geometry
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);

        const uvs = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]);

        // Create buffers
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

        this.uvBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, uvs, this.gl.STATIC_DRAW);

        // Set up attributes
        const positionLocation = this.gl.getAttribLocation(this.program, 'position');
        const uvLocation = this.gl.getAttribLocation(this.program, 'uv');

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.enableVertexAttribArray(uvLocation);
        this.gl.vertexAttribPointer(uvLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Set uniforms with the exact settings from the second demo
        this.setUniform('uFocal', '2f', [0.5, 0.5]);
        this.setUniform('uRotation', '2f', [1.0, 0.0]);
        this.setUniform('uStarSpeed', '1f', 0.5);
        this.setUniform('uDensity', '1f', this.options.density);
        this.setUniform('uHueShift', '1f', this.options.hueShift);
        this.setUniform('uSpeed', '1f', this.options.speed);
        this.setUniform('uGlowIntensity', '1f', this.options.glowIntensity);
        this.setUniform('uSaturation', '1f', this.options.saturation);
        this.setUniform('uMouseRepulsion', '1i', this.options.mouseRepulsion ? 1 : 0);
        this.setUniform('uTwinkleIntensity', '1f', this.options.twinkleIntensity);
        this.setUniform('uRotationSpeed', '1f', this.options.rotationSpeed);
        this.setUniform('uRepulsionStrength', '1f', this.options.repulsionStrength);
        this.setUniform('uAutoCenterRepulsion', '1f', 0);
        this.setUniform('uTransparent', '1i', this.options.transparent ? 1 : 0);
    }

    setUniform(name, type, value) {
        const location = this.gl.getUniformLocation(this.program, name);
        if (location === null) return;

        switch (type) {
            case '1f':
                this.gl.uniform1f(location, value);
                break;
            case '2f':
                this.gl.uniform2f(location, value[0], value[1]);
                break;
            case '3f':
                this.gl.uniform3f(location, value[0], value[1], value[2]);
                break;
            case '1i':
                this.gl.uniform1i(location, value);
                break;
        }
    }

    addEventListeners() {
        if (this.options.mouseInteraction) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX / window.innerWidth;
                this.mouse.y = 1.0 - (e.clientY / window.innerHeight);
                this.mouseActive = 1.0;
            });

            window.addEventListener('mouseleave', () => {
                this.mouseActive = 0.0;
            });
        }

        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    animate() {
        this.animateId = requestAnimationFrame(() => this.animate());

        const time = (Date.now() - this.startTime) * 0.001;
        
        // Update uniforms
        this.setUniform('uTime', '1f', time);
        this.setUniform('uStarSpeed', '1f', (time * 0.5) / 10.0);

        // Smooth mouse movement
        const lerpFactor = 0.05;
        this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * lerpFactor;
        this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * lerpFactor;
        this.smoothMouseActive += (this.mouseActive - this.smoothMouseActive) * lerpFactor;

        this.setUniform('uMouse', '2f', [this.smoothMouse.x, this.smoothMouse.y]);
        this.setUniform('uMouseActiveFactor', '1f', this.smoothMouseActive);

        // Render
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    destroy() {
        if (this.animateId) {
            cancelAnimationFrame(this.animateId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.gl) {
            this.gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
    }
} 