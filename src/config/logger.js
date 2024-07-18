import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, errors } = format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const devLogger = createLogger({
  level: 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console()
  ],
});

const prodLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'errors.log', level: 'error' })
  ],
});

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger;