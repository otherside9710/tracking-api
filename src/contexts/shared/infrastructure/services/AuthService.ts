import fetch from 'node-fetch';
import { config } from '@app/config/environment';
import { TokenError } from '@shared/token/domain/errors';

interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
  id_token?: string;
}

interface PasswordGrantParams {
  username: string;
  password: string;
}

export class AuthService {
  static async getPasswordGrantToken({ username, password }: PasswordGrantParams): Promise<AuthResponse> {
    try {
      const response = await fetch(`${config.auth.domain}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: config.auth.granType,
          username,
          password,
          audience: config.auth.audience,
          scope: 'openid profile email',
          client_id: config.auth.clientId,
          client_secret: config.auth.clientSecret,
          realm: 'Username-Password-Authentication',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log('Token error response:', error);
        throw new TokenError('Error al obtener token de usuario');
      }

      return response.json() as Promise<AuthResponse>;
    } catch (error) {
      throw new TokenError('Error al obtener token de usuario');
    }
  }
}