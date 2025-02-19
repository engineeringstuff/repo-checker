import { Logger } from '@/app/lib/server/Logger';
import path from 'path';
import simpleGit from 'simple-git';

const git = simpleGit();

// eslint-disable-next-line
export class Git {
	static async Clone(repoUrl: string) {
		const parent = path.resolve('../');
		const target = `${parent}/${(repoUrl.split('/').pop() ?? '').replace('.git', '')}`;
		try {
			return await git.clone(repoUrl, target);
		} catch (error) {
			Logger.error('Error cloning repository:', { error });
		}
		return target;
	}
}
