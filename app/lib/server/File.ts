import { Logger } from '@/app/lib/server/Logger';
import fs from 'fs/promises';
import ignore from 'ignore';
import path from 'path';

// eslint-disable-next-line
export class File {
	static async ReadFile(filePath: string) {
		return await fs.readFile(filePath, 'utf8');
	}

	static async GetDirectoryTree(dirPath: string) {
		return File.GetDirectoryTreeInternal(dirPath, dirPath, ignore().add(['.git/*']));
	}

	static async GetDirectoryTreeInternal(dirPath: string, rootPath: string, ig: ignore.Ignore) {
		const files: string[] = [];
		try {
			const entries = await fs.readdir(dirPath, { withFileTypes: true });

			await Promise.all(
				entries.map(async (entry) => {
					const fullPath = path.join(dirPath, entry.name);
					if (entry.isDirectory()) {
						files.push(...(await File.GetDirectoryTreeInternal(fullPath, rootPath, ig)));
					} else {
						const shouldIgnore = ig?.ignores(path.relative(rootPath, fullPath));
						if (!shouldIgnore) {
							if (entry.name == '.gitignore') {
								const gitIgnoreContent = await File.ReadFile(fullPath);
								const rules = gitIgnoreContent.split('\n').filter((g) => !!g && !g.startsWith('#'));
								ig = ignore().add(rules);
							}

							files.push(fullPath);
						}
					}
				}),
			);

			return files;
		} catch (error) {
			Logger.error(`Error reading directory: ${dirPath}`, { error });
		}
		return files;
	}
}
