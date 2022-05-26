const { readdir, copyFile, rm, mkdir } = require('fs/promises');
const path = require('path');
const { stdout } = process;

const srcPath = path.join(__dirname, 'files');
const dstPath = path.join(__dirname, 'files-copy');
async function copyDir(srcPath, dstPath) {
  try {
    const files = await readdir(srcPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.join(srcPath, file.name), path.join(dstPath, file.name));
      }
      else if (file.isDirectory()) {
        await mkdir(path.join(dstPath, file.name));
        await copyDir(path.join(srcPath, file.name), path.join(dstPath, file.name));
      }
    }
  }
  catch (error) {
    stdout.write(error);
  }
}

(async function () {
  await rm(dstPath, { recursive: true, force: true });
  await mkdir(dstPath, { recursive: true });
  await copyDir (srcPath, dstPath);
})();

