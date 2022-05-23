const fs = require('fs');
const path = require('path');
const { stdout, stderr } = require('process');
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
let data = '';
readStream.on('data', chunk => data += chunk);
readStream.on('end', () => stdout.write(data));