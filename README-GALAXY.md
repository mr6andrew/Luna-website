# Luna - The Mystical Wanderer (Galaxy Background) 🌌

This version of the website features a stunning WebGL galaxy background powered by the `ogl` library, creating an immersive cosmic experience for Luna's mystical journey.

## ✨ New Features

### 🌌 WebGL Galaxy Background
- **Interactive star field** with 1500+ animated stars
- **Mouse repulsion** - stars move away from your cursor
- **Twinkling effects** with customizable glow intensity
- **Color customization** with hue shift and saturation controls
- **Performance optimized** with efficient WebGL rendering

### 🎛️ Galaxy Configuration Options
```javascript
const galaxy = new Galaxy({
    mouseRepulsion: true,      // Stars move away from mouse
    mouseInteraction: true,     // Enable mouse interaction
    density: 1.5,              // Star density multiplier
    glowIntensity: 0.5,        // Star glow intensity (0-1)
    saturation: 0.8,           // Color saturation (0-1)
    hueShift: 240              // Base hue in degrees (0-360)
});
```

## 🚀 How to Use

### Option 1: Direct Browser (Recommended)
1. Open `index-galaxy.html` in a modern web browser
2. Experience the interactive galaxy background
3. Move your mouse to see stars react to your cursor

### Option 2: Development Server
1. Run `npx http-server . -p 8080`
2. Open `http://localhost:8080/index-module.html`
3. For ES6 module support

### Option 3: Original Version
1. Open `index.html` for the original CSS-only version
2. No WebGL background, but all other features work

## 🛠️ Technical Details

### Dependencies
- **ogl**: WebGL library for efficient 3D rendering
- **Vanilla JavaScript**: No frameworks required
- **ES6 Modules**: Modern JavaScript features

### Performance Features
- **60fps rendering** with requestAnimationFrame
- **Efficient WebGL shaders** for star rendering
- **Throttled mouse events** for smooth interaction
- **Automatic cleanup** and memory management

### Browser Support
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile**: Limited (WebGL performance varies)

## 🎨 Customization

### Changing Galaxy Colors
```javascript
// Blue galaxy
hueShift: 240, saturation: 0.8

// Purple galaxy
hueShift: 280, saturation: 0.9

// Green galaxy
hueShift: 120, saturation: 0.7

// Red galaxy
hueShift: 0, saturation: 0.8
```

### Adjusting Star Density
```javascript
// Sparse stars
density: 0.8

// Dense stars
density: 2.0
```

### Modifying Glow Effects
```javascript
// Subtle glow
glowIntensity: 0.3

// Bright glow
glowIntensity: 0.8
```

## 📁 File Structure

```
character-website/
├── index.html              # Original version (CSS background)
├── index-galaxy.html       # Galaxy version (WebGL background)
├── index-module.html       # ES6 module version
├── styles.css              # All CSS styles
├── script.js               # Main JavaScript (ES6 modules)
├── script-bundled.js       # Bundled JavaScript (browser compatible)
├── galaxy.js               # WebGL galaxy component
├── build.js                # Build script for bundling
├── package.json            # NPM dependencies
├── node_modules/           # Installed packages
└── README-GALAXY.md       # This file
```

## 🔧 Development

### Installing Dependencies
```bash
npm install
```

### Building Bundled Version
```bash
node build.js
```

### Running Development Server
```bash
npx http-server . -p 8080
```

## 🌟 Interactive Elements

1. **Galaxy Background**: Move mouse to see stars react
2. **Quote Generator**: Click button or press spacebar
3. **Gallery Hover**: Mouse over images for overlay
4. **Bio Cards**: Hover for 3D effects
5. **Easter Egg**: Click sparkle icon in corner
6. **Scroll Navigation**: Smooth section transitions

## 🎯 Performance Tips

- **Desktop**: Full 60fps performance
- **Mobile**: Reduced star count for better performance
- **Low-end devices**: Disable mouse interaction for better performance
- **Battery saving**: Galaxy automatically pauses when tab is not visible

## 🐛 Troubleshooting

### Galaxy Not Loading
- Ensure WebGL is supported in your browser
- Check browser console for errors
- Try the original `index.html` version

### Performance Issues
- Reduce `density` value in galaxy options
- Disable `mouseInteraction` for better performance
- Use `index.html` for CSS-only version

### Module Errors
- Use `index-galaxy.html` for bundled version
- Or run with a local server for ES6 modules

---

**Experience Luna's mystical journey with an interactive cosmic background!** 🌌✨ 