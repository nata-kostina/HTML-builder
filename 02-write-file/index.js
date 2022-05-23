const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

let writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
process.on('SIGINT', () => {
	stdout.write('caught interrupt signal');
	process.exit();
});

process.on('exit', () => {
	writeableStream.end();
	process.exit();
});

stdout.write('Enter some text...\n');
stdin.on('data', data => {
	if (data.toString().trim() === 'exit') {
		stdout.write('caught exit');
		process.exit();
	}
	writeableStream.write(data);
});