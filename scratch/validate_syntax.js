const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Extract script tag contents
const scriptRegex = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const code = match[1];
    try {
        new Function(code);
        console.log(`Script block #${count}: syntax valid (length: ${code.length})`);
    } catch (err) {
        console.error(`Script block #${count} error:`, err.message);
        process.exit(1);
    }
}
console.log('All script blocks successfully validated!');
