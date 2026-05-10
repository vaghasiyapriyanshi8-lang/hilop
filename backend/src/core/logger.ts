import { createLogger as winstonCreateLogger, format, transports } from 'winston';

export const createLogger = (label: string) =>
  winstonCreateLogger({
    level: 'info',
    format: format.combine(
      format.label({ label }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
    exitOnError: false,
  });
