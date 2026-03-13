import type { IDateProvider } from "../application/dateProvider.port.ts";

export class RealDateProvider implements IDateProvider {
  now(): Date {
    return new Date();
  }
}
