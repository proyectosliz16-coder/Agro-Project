import { readFileSync, writeFileSync } from 'fs';

const htmlPath = './dist/index.html';
let html = readFileSync(htmlPath, 'utf8');

// Remove type="module" and add defer so the script waits for the DOM (works with file://)
html = html.replace(/<script type="module"/g, '<script defer');
// Remove crossorigin attributes (not needed for local files)
html = html.replace(/ crossorigin/g, '');

writeFileSync(htmlPath, html, 'utf8');
console.log('✅ dist/index.html patched');

// Generate root index.html with paths pointing to dist/assets/
const rootHtml = html.replace(/src="\.\/assets\//g, 'src="./dist/assets/')
                     .replace(/href="\.\/assets\//g, 'href="./dist/assets/')
                     .replace(/href="\/vite\.svg"/g, 'href="./dist/vite.svg"')
                     .replace(/href="\.\/vite\.svg"/g, 'href="./dist/vite.svg"');

writeFileSync('./index.html', rootHtml, 'utf8');
console.log('✅ index.html created at root → open file:///C:/xampp/htdocs/Agro/index.html');
