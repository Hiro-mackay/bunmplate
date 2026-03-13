import { SignJWT } from "jose";
import type { ITokenProvider, TokenPayload } from "../application/ports/tokenProvider.port.ts";

export class JwtTokenProvider implements ITokenProvider {
  private readonly secret: Uint8Array;

  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret);
  }

  async sign(payload: TokenPayload): Promise<string> {
    return new SignJWT({ sub: payload.userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(this.secret);
  }
}
