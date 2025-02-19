import { Helper } from '@/app/lib/Helper';
import chalk from 'chalk';
import { Logger as OtherLogger, type ILogObj } from 'tslog';

const log = new OtherLogger<ILogObj>({
	type: 'pretty',
	prettyLogTemplate: '{{logLevelName}} ',
});

export type LoggerDebugParams = Record<string, unknown>;

// eslint-disable-next-line
export class Logger {
	static log(message?: unknown, params?: Record<string, unknown> | undefined) {
		log.info(message, params ?? '');
	}

	static debug(message: string, params?: LoggerDebugParams | undefined) {
		log.debug(chalk.bold(`> ${Helper.ToString(message)}`), params ?? '');
	}

	static error(message?: unknown, params?: Record<string, unknown> | undefined) {
		log.error(message, params ?? '');
	}
}
