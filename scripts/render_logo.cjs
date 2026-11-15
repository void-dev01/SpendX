const fs = require('fs');
const path = require('path');
const { Resvg } = require('../frontend/node_modules/@resvg/resvg-js');

const svg = `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <text x="50" y="65" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="800" fill="#101827" letter-spacing="1">SPEND<tspan fill="#7651E8">X</tspan></text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 800 }
});
const pngData = resvg.render();
fs.writeFileSync('test_render.png', pngData.asPng());
console.log('Successfully written test_render.png, bytes:', fs.statSync('test_render.png').size);
