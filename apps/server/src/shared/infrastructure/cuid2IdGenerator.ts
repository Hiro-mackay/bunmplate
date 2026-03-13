import { createId } from "@paralleldrive/cuid2";
import type { IIdGenerator } from "../application/idGenerator.port.ts";

export class Cuid2IdGenerator implements IIdGenerator {
  generate(): string {
    return createId();
  }
}
