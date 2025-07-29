// Galaxy component will be loaded separately
// Note: This is vanilla JavaScript, not React/Webpack

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

// Parallax scroll effects
function initParallaxScroll() {
    console.log('Initializing parallax scroll...');
    
    const bubbles = document.querySelector('.bubbles');
    const floatingElements = document.querySelector('.floating-elements');
    const heroContent = document.querySelector('.hero-content');
    
    console.log('Bubbles element:', bubbles);
    console.log('Floating elements:', floatingElements);
    console.log('Hero content:', heroContent);
    
    // Get screen width for responsive adjustments
    const screenWidth = window.innerWidth;
    
    // Adjust bubble animation for mobile
    if (screenWidth < 400) {
        if (bubbles) {
            bubbles.style.setProperty('--transform-duration', '15s');
            bubbles.style.setProperty('--transform-y', '-700vh');
        }
    }

    // Simple scroll event for testing
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        console.log('Scroll Y:', scrollY);
        
        // Make the effect very obvious for testing
        const testElement = document.querySelector('.hero-content');
        if (testElement) {
            testElement.style.transform = `translateY(${scrollY * 2}px)`;
            testElement.style.color = `hsl(${scrollY % 360}, 70%, 70%)`;
            console.log('Test element moved and color changed');
        }
        
        // Bubble parallax effect - make it more noticeable
        if (bubbles) {
            bubbles.style.transform = `translateY(${scrollY * 0.3}px)`;
            console.log('Bubbles transformed');
        }
        
        // Floating elements parallax - make it more noticeable
        if (floatingElements) {
            floatingElements.style.transform = `translateY(${scrollY * -0.5}px)`;
            console.log('Floating elements transformed');
        }
        
        // Hero content parallax - make it more noticeable
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.8}px)`;
            console.log('Hero content transformed');
        }
    });
    
    console.log('Parallax scroll initialized');
}

// Initialize all functionality
function init() {
    console.log('Init function called');
    
    // Initialize Advanced Galaxy background with exact settings from second demo
    console.log('About to initialize AdvancedGalaxy...');
    console.log('AdvancedGalaxy class exists:', typeof AdvancedGalaxy);
    
    // Initialize WebGL Galaxy background
    try {
        const galaxy = new WebGLGalaxy({
            mouseRepulsion: true,
            mouseInteraction: true,
            density: 1.0,
            glowIntensity: 0.3,
            saturation: 0.0,
            hueShift: 140,
            starSpeed: 0.5,
            speed: 1.0,
            twinkleIntensity: 0.3,
            rotationSpeed: 0.1,
            repulsionStrength: 2,
            transparent: true
        });
        console.log('WebGL Galaxy initialized successfully');
    } catch (error) {
        console.log('WebGL Galaxy initialization failed:', error);
    }
    
    // Initialize parallax scroll effects
    console.log('Calling initParallaxScroll...');
    // Temporarily disable parallax to test galaxy
    // initParallaxScroll();
    
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

// Add a simple test to confirm script is loading
console.log('Script.js loaded successfully!');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, script is working!');
});

// Loading screen functionality
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Hide loading screen after everything is loaded
window.addEventListener('load', () => {
    setTimeout(hideLoadingScreen, 2000); // Show loading for 2 seconds
});

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