export interface TokenPayload {
  userId: string;
}

export interface ITokenProvider {
  sign(payload: TokenPayload): Promise<string>;
}
