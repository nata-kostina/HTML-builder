
const { mkdir, rm, readdir, readFile, writeFile, copyFile } = require('fs/promises');
const path = require('path');
const { stderr, stdout } = process;
const fs = require('fs');

const templatePath = path.join(__dirname, 'template.html');
const componentsSrcPath = path.join(__dirname, 'components');
const stylesSrcPath = path.join(__dirname, 'styles');
const assetsSrcPath = path.join(__dirname, 'assets');

const dstPath = path.join(__dirname, 'project-dist');
const indexPath = path.join(dstPath, 'index.html');
const styleDstPath = path.join(dstPath, 'style.css');
const assetsDstPath = path.join(dstPath, 'assets');

(async () => {
	try {
		await rm(dstPath, { recursive: true, force: true })
		await mkdir(dstPath, { recursive: true });
		let templateData = await readFile(templatePath, 'utf-8');
		const components = await readdir(componentsSrcPath);
		for (const component of components) {
			const componentName = component.slice(0, component.lastIndexOf('.'));
			const componentPath = path.join(componentsSrcPath, component);
			const componentData = await readFile(componentPath, 'utf-8');
			templateData = templateData.replace(`{{${componentName}}}`, componentData);
		}
		await writeFile(indexPath, templateData);
		stdout.write('index.html is created\n');

		let writeStream = fs.createWriteStream(styleDstPath);

		const files = await readdir(stylesSrcPath, { withFileTypes: true });

		for (const file of files) {
			if (file.isFile()) {
				const fileType = path.extname(path.join(__dirname, file.name)).substring(1);
				if (fileType === 'css') {
					const buffer = [];
					const readStream = fs.createReadStream(path.join(stylesSrcPath, file.name));
					readStream.on('data', (chunk) => buffer.push(chunk.toString()));
					readStream.on('end', () => writeStream.write(buffer.join('\n')));
				}
			}
		}
		stdout.write('style.css is created\n');

		async function copyDir(srcPath, dstPath) {
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
		};
		await mkdir(assetsDstPath, { recursive: true });
		await copyDir(assetsSrcPath, assetsDstPath);
		stdout.write('assets are copied');
	}

	catch (e) {
		stderr.write('Error');
	}
})();


