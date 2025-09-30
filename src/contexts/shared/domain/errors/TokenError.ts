import { DomainError } from '@shared/domain/errors';

export class TokenError extends DomainError {
  constructor(message: string) {
    super(message, 'TOKEN_ERROR', 401);
  }

  static invalidCredentials(): TokenError {
    return new TokenError('Las credenciales proporcionadas son inválidas');
  }

  static authenticationFailed(): TokenError {
    return new TokenError('Error al autenticar el usuario');
  }
}
