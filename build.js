const fs = require('fs');
const path = require('path');

// Read the galaxy-simple.js file
const galaxyCode = fs.readFileSync('galaxy-simple.js', 'utf8');

// Read the script.js file
const scriptCode = fs.readFileSync('script.js', 'utf8');

// Create a bundled version
const bundledCode = `
// Bundled version for browser compatibility
${galaxyCode}

// Main script
${scriptCode.replace('import \'./galaxy-simple.js\';', '')}
`;

// Write the bundled file
fs.writeFileSync('script-bundled.js', bundledCode);

console.log('Bundled script created: script-bundled.js'); 