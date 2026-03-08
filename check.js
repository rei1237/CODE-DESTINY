const fs = require('fs');
const text = fs.readFileSync('index.html', 'utf8');
const rx = /<div id="\w+ModalSheet"[^>]+>\s*<div[^>]+padding:.*?box-sizing:border-box;/g;
let match;
while ((match = rx.exec(text)) !== null) {
    console.log(match[0]);
}