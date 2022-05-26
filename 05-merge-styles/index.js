const fs = require('fs');
const { readdir, mkdir, rm } = require('fs/promises');
const path = require('path');
const { stderr } = process;

(async () => {
  try {
    const srcPath = path.join(__dirname, 'styles');
    const dstPath = path.join(__dirname, 'project-dist');
    // await rm(dstPath, { recursive: true, force: true });
    await mkdir(dstPath, { recursive: true });
	
    let writeStream = fs.createWriteStream(path.join(dstPath, 'bundle.css'));

    const files = await readdir(srcPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const fileType = path.extname(path.join(__dirname, file.name)).substring(1);
        if (fileType === 'css') {
          const buffer = [];
          const readStream = fs.createReadStream(path.join(srcPath, file.name));
          readStream.on('data', (chunk) => buffer.push(chunk.toString()));
          readStream.on('end', () => writeStream.write(buffer.join('\n')));
        }
      }
    }
  }
  catch (error) {
    stderr.write(error);
  }

})();
