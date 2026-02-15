
const fs = require('fs');

const filePath = 'src/zod/index.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const newContent = content.replace(/z\.uuid\(\)/g, "z.string().uuid()");

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Replaced z.uuid() with z.string().uuid()');
