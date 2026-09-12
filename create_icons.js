const fs = require('fs');
const size = 192;
const buffer = Buffer.alloc(100); // Create a minimal dummy valid image or just leave empty but valid png header
// We'll just generate an SVG and write it as png/ico for now which might not perfectly parse but better than empty
const svgContent = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg"><rect width="192" height="192" fill="#2e7d32"/></svg>`;
fs.writeFileSync('icon-192.svg', svgContent);
