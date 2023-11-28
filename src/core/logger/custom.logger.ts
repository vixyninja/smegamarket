import {Injectable, Logger, Scope} from '@nestjs/common';

@Injectable({scope: Scope.TRANSIENT})
export class LoggerService extends Logger {
  private prefix: string;

  constructor(prefix: string) {
    super();
    this.prefix = prefix;
  }

  error(message: string, trace?: string, context?: string): void {
    super.error(`${this.prefix} ${message}`, trace, context);
  }

  warn(message: string, context?: string): void {
    super.warn(`${this.prefix} ${message}`, context);
  }

  log(message: string, context?: string): void {
    super.log(`${this.prefix} ${message}`, context);
  }

  debug(message: string, context?: string): void {
    super.debug(`${this.prefix} ${message}`, context);
  }

  verbose(message: string, context?: string): void {
    super.verbose(`${this.prefix} ${message}`, context);
  }
}
