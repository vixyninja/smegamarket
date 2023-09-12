export type TokenType = {
  accessToken: string;
  refreshToken: string;
};

export type JWTPayload = {
  email: string;
  uuid: string;
};
