
// Bundled version for browser compatibility
class SimpleGalaxy {
    constructor(options = {}) {
        this.options = {
            mouseRepulsion: options.mouseRepulsion || true,
            mouseInteraction: options.mouseInteraction || true,
            density: options.density || 1.5,
            glowIntensity: options.glowIntensity || 0.5,
            saturation: options.saturation || 0.8,
            hueShift: options.hueShift || 240,
            ...options
        };

        this.mouse = { x: 0, y: 0 };
        this.stars = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)';
        
        document.body.appendChild(this.canvas);
        
        // Get context
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resize();
        
        // Create stars
        this.createStars();
        
        // Add event listeners
        this.addEventListeners();
        
        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        const starCount = Math.floor(200 * this.options.density);
        
        for (let i = 0; i < starCount; i++) {
            const star = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                hue: (Math.random() * 60 + this.options.hueShift) / 360,
                twinkle: Math.random() * Math.PI * 2
            };
            this.stars.push(star);
        }
    }

    hsvToRgb(h, s, v) {
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        let r, g, b;
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    addEventListeners() {
        if (this.options.mouseInteraction) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            window.addEventListener('mouseleave', () => {
                this.mouse.x = 0;
                this.mouse.y = 0;
            });
        }

        window.addEventListener('resize', () => {
            this.resize();
            this.stars = [];
            this.createStars();
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Clear canvas with gradient
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(26, 26, 46, 0.8)');
        gradient.addColorStop(0.5, 'rgba(22, 33, 62, 0.6)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 0.9)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() * 0.001;

        // Update and draw stars
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            
            // Update position
            star.x += star.vx;
            star.y += star.y;
            star.twinkle += 0.05;

            // Wrap around edges
            if (star.x < 0) star.x = this.canvas.width;
            if (star.x > this.canvas.width) star.x = 0;
            if (star.y < 0) star.y = this.canvas.height;
            if (star.y > this.canvas.height) star.y = 0;

            // Mouse repulsion
            if (this.options.mouseRepulsion && this.mouse.x > 0 && this.mouse.y > 0) {
                const dx = star.x - this.mouse.x;
                const dy = star.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    star.x += (dx / distance) * force * 2;
                    star.y += (dy / distance) * force * 2;
                }
            }

            // Calculate twinkling
            const twinkle = Math.sin(star.twinkle) * 0.3 + 0.7;
            
            // Get color
            const color = this.hsvToRgb(star.hue, this.options.saturation, star.brightness * twinkle);
            
            // Draw star with glow
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            
            // Glow effect
            const glowSize = star.size * 3 * this.options.glowIntensity;
            const glowGradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, glowSize
            );
            glowGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 * twinkle})`);
            glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.fillRect(star.x - glowSize, star.y - glowSize, glowSize * 2, glowSize * 2);
            
            // Star core
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${twinkle})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }

    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Export for use in main script
window.SimpleGalaxy = SimpleGalaxy; 

// Main script
// Import Simple Galaxy component


// Quote Generator - Array of Luna's wisdom
const quotes = [
    "The stars speak to those who listen with their hearts, not just their eyes.",
    "Every journey begins with a single step into the unknown.",
    "The moon's light is gentle, but its wisdom is profound.",
    "In the darkest night, the stars shine brightest.",
    "Time flows like a river, but memories are eternal.",
    "The universe whispers secrets to those who dare to dream.",
    "Magic exists in the spaces between what we know and what we believe.",
    "Every constellation tells a story waiting to be discovered.",
    "The path to wisdom is paved with curiosity and wonder.",
    "In the silence between worlds, truth reveals itself.",
    "The cosmos dances to a rhythm only the heart can hear.",
    "Every ending is a new beginning in disguise."
];

// DOM Elements
const quoteBtn = document.getElementById('quoteBtn');
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = quoteDisplay.querySelector('.quote-text');
const easterEgg = document.getElementById('easterEgg');
const easterEggMessage = document.getElementById('easterEggMessage');
const characterName = document.getElementById('characterName');
const characterIntro = document.getElementById('characterIntro');

// Typing Animation Function
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Quote Generator Function
function generateQuote() {
    // Add loading state
    quoteBtn.disabled = true;
    quoteBtn.querySelector('span').textContent = 'Loading...';
    
    // Simulate loading delay
    setTimeout(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        // Clear previous content
        quoteText.innerHTML = '';
        
        // Type the new quote
        typeWriter(quoteText, randomQuote, 30);
        
        // Reset button
        quoteBtn.disabled = false;
        quoteBtn.querySelector('span').textContent = 'Get Wisdom';
        
        // Add a subtle animation to the quote display
        quoteDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            quoteDisplay.style.transform = 'scale(1)';
        }, 200);
    }, 500);
}

// Easter Egg Functionality
function showEasterEgg() {
    easterEggMessage.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeEasterEgg() {
    easterEggMessage.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Scroll Animation Observer
function createScrollObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => observer.observe(el));
}

// Parallax Effect for Floating Elements
function createParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const stars = document.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            star.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Smooth Scroll Navigation
function createSmoothScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced Typing Effect for Hero Section
function initHeroAnimations() {
    // Animate character name
    setTimeout(() => {
        typeWriter(characterName, 'Luna', 150);
    }, 1000);
    
    // Animate character intro
    setTimeout(() => {
        typeWriter(characterIntro, 'The Mystical Wanderer', 100);
    }, 2500);
}

// Gallery Hover Effects
function initGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Bio Cards Animation
function initBioCardAnimations() {
    const bioCards = document.querySelectorAll('.bio-card');
    
    bioCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
}

// Button Click Effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('button, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple effect CSS dynamically
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button, .social-link {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Escape':
                if (easterEggMessage.style.display === 'flex') {
                    closeEasterEgg();
                }
                break;
            case ' ':
                e.preventDefault();
                generateQuote();
                break;
        }
    });
}

// Performance Optimization - Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize all functionality
function init() {
    // Initialize Simple Galaxy background
    const galaxy = new SimpleGalaxy({
        mouseRepulsion: true,
        mouseInteraction: true,
        density: 1.5,
        glowIntensity: 0.5,
        saturation: 0.8,
        hueShift: 240
    });
    
    // Add ripple styles
    addRippleStyles();
    
    // Initialize scroll observer
    createScrollObserver();
    
    // Initialize parallax effect
    createParallaxEffect();
    
    // Initialize smooth scroll
    createSmoothScroll();
    
    // Initialize hero animations
    initHeroAnimations();
    
    // Initialize gallery effects
    initGalleryEffects();
    
    // Initialize bio card animations
    initBioCardAnimations();
    
    // Initialize button effects
    initButtonEffects();
    
    // Initialize keyboard navigation
    initKeyboardNavigation();
    
    // Event listeners
    quoteBtn.addEventListener('click', generateQuote);
    easterEgg.addEventListener('click', showEasterEgg);
    
    // Throttled scroll event for performance
    const throttledScroll = throttle(() => {
        // Additional scroll-based animations can be added here
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScroll);
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add some fun interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle effect to easter egg
    easterEgg.addEventListener('mouseenter', () => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '1rem';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        easterEgg.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    });
    
    // Add sparkle animation CSS
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkle {
            0% {
                opacity: 1;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: scale(1.5) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(sparkleStyle);
});

// Add loading state styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle); 
