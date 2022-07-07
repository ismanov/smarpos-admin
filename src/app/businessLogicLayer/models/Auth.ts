type Auth = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  iat: number;
  user_id: number;
  permissions?: [string];
  jti: string;
};
