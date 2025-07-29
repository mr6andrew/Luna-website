import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Plane, Vec2, Vec3 } from 'ogl';

const Galaxy = ({ 
    mouseRepulsion = true,
    mouseInteraction = true,
    density = 1.5,
    glowIntensity = 0.5,
    saturation = 0.8,
    hueShift = 240
}) => {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const programRef = useRef(null);
    const meshRef = useRef(null);
    const starsRef = useRef([]);
    const mouseRef = useRef(new Vec2());
    const animationRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Create renderer
        const renderer = new Renderer({
            canvas: canvasRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gl.clearColor(0, 0, 0, 0);
        rendererRef.current = renderer;

        // Create stars
        const starCount = Math.floor(1000 * density);
        const stars = [];
        
        for (let i = 0; i < starCount; i++) {
            const star = {
                position: new Vec3(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 2
                ),
                velocity: new Vec3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.005
                ),
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                hue: (Math.random() * 60 + hueShift) / 360
            };
            stars.push(star);
        }
        starsRef.current = stars;

        // Vertex shader
        const vertexShader = `
            attribute vec3 position;
            attribute float size;
            attribute float brightness;
            attribute float hue;
            
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform vec2 mouse;
            uniform float time;
            
            varying float vBrightness;
            varying float vHue;
            varying float vSize;
            
            void main() {
                vec3 pos = position;
                
                // Add some movement
                pos.x += sin(time * 0.5 + position.y) * 0.1;
                pos.y += cos(time * 0.3 + position.x) * 0.1;
                
                // Mouse repulsion
                if (mouse.x != 0.0 || mouse.y != 0.0) {
                    vec2 mousePos = mouse * 2.0 - 1.0;
                    vec2 starPos = vec2(pos.x, pos.y);
                    float dist = distance(starPos, mousePos);
                    if (dist < 0.5) {
                        vec2 dir = normalize(starPos - mousePos);
                        pos.xy += dir * (0.5 - dist) * 0.1;
                    }
                }
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * (300.0 / -mvPosition.z);
                
                vBrightness = brightness;
                vHue = hue;
                vSize = size;
            }
        `;

        // Fragment shader
        const fragmentShader = `
            precision highp float;
            
            varying float vBrightness;
            varying float vHue;
            varying float vSize;
            
            uniform float time;
            uniform float glowIntensity;
            uniform float saturation;
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
                vec2 center = gl_PointCoord - 0.5;
                float dist = length(center);
                
                if (dist > 0.5) discard;
                
                // Create star shape
                float star = 1.0 - smoothstep(0.0, 0.5, dist);
                
                // Add twinkling effect
                float twinkle = sin(time * 2.0 + vHue * 10.0) * 0.3 + 0.7;
                
                // Create glow effect
                float glow = exp(-dist * 4.0) * glowIntensity;
                
                // Combine effects
                float alpha = star * vBrightness * twinkle + glow;
                
                // Convert HSV to RGB
                vec3 color = hsv2rgb(vec3(vHue, saturation, 1.0));
                
                gl_FragColor = vec4(color, alpha);
            }
        `;

        // Create program
        const program = new Program(renderer.gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                time: { value: 0 },
                mouse: { value: new Vec2() },
                glowIntensity: { value: glowIntensity },
                saturation: { value: saturation }
            },
            attributes: {
                position: { size: 3, data: new Float32Array(stars.length * 3) },
                size: { size: 1, data: new Float32Array(stars.length) },
                brightness: { size: 1, data: new Float32Array(stars.length) },
                hue: { size: 1, data: new Float32Array(stars.length) }
            }
        });
        programRef.current = program;

        // Create mesh
        const mesh = new Mesh(renderer.gl, {
            geometry: new Plane(renderer.gl, { width: 2, height: 2 }),
            program: program
        });
        meshRef.current = mesh;

        // Update attribute data
        const updateAttributes = () => {
            const positions = new Float32Array(stars.length * 3);
            const sizes = new Float32Array(stars.length);
            const brightnesses = new Float32Array(stars.length);
            const hues = new Float32Array(stars.length);

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                positions[i * 3] = star.position.x;
                positions[i * 3 + 1] = star.position.y;
                positions[i * 3 + 2] = star.position.z;
                sizes[i] = star.size;
                brightnesses[i] = star.brightness;
                hues[i] = star.hue;
            }

            program.attributes.position.data = positions;
            program.attributes.size.data = sizes;
            program.attributes.brightness.data = brightnesses;
            program.attributes.hue.data = hues;
        };

        updateAttributes();

        // Animation function
        const animate = () => {
            const time = Date.now() * 0.001;

            // Update star positions
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.position.add(star.velocity);
                
                // Wrap around edges
                if (star.position.x > 2) star.position.x = -2;
                if (star.position.x < -2) star.position.x = 2;
                if (star.position.y > 2) star.position.y = -2;
                if (star.position.y < -2) star.position.y = 2;
                if (star.position.z > 1) star.position.z = -1;
                if (star.position.z < -1) star.position.z = 1;
            }

            // Update uniforms
            program.uniforms.time.value = time;
            program.uniforms.mouse.value = mouseRef.current;

            // Update attributes
            updateAttributes();

            // Render
            renderer.render({ scene: mesh });

            animationRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        // Event listeners
        const handleMouseMove = (e) => {
            if (mouseInteraction) {
                mouseRef.current.x = e.clientX / window.innerWidth;
                mouseRef.current.y = 1 - e.clientY / window.innerHeight;
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = 0;
            mouseRef.current.y = 0;
        };

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        if (mouseInteraction) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseleave', handleMouseLeave);
        }
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (mouseInteraction) {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseleave', handleMouseLeave);
            }
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, [mouseRepulsion, mouseInteraction, density, glowIntensity, saturation, hueShift]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default Galaxy; 