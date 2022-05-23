const path = require('path');
const fs = require('fs/promises');
const { stdout } = process;
(async () => {
	try {
		const files = await fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
		for (const file of files) {
			if (file.isFile()) {
				const fullFileName = file.name;
				const fileName = fullFileName.split('.')[0];
				const pathToFile = path.join(__dirname, 'secret-folder', fullFileName);
				const fileType = path.extname(pathToFile).substring(1);
				const stats = await fs.stat(pathToFile);
				stdout.write(`${fileName} - ${fileType} - ${stats.size}b`);
			}
		}
	} catch (err) {
		stdout.write(err);
	}
})();
