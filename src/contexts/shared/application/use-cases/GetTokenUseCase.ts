import { AuthService } from '@app/contexts/shared/infrastructure/services/AuthService';
import { TokenError } from '@app/contexts/shared/domain/errors';

interface GetTokenUseCaseRequest {
  username: string;
  password: string;
}

interface GetTokenUseCaseResponse {
  access_token: string;
  id_token?: string;
  scope?: string;
  expires_in: number;
  token_type: string;
}

export class GetTokenUseCase {
  async execute({
    username,
    password,
  }: GetTokenUseCaseRequest): Promise<GetTokenUseCaseResponse> {
    try {
      if (!username || !password) {
        throw TokenError.invalidCredentials();
      }

      const response = await AuthService.getPasswordGrantToken({
        username,
        password,
      });

      if (!response.access_token) {
        throw TokenError.authenticationFailed();
      }

      return {
        access_token: response.access_token,
        expires_in: response.expires_in,
        token_type: response.token_type,
      };
    } catch (error) {
      if (error instanceof TokenError) {
        throw error;
      }
      throw TokenError.authenticationFailed();
    }
  }
}
