import { TokenError } from '@shared/domain/errors';

describe('TokenError', () => {
  it('should create error with direct message', () => {
    const error = new TokenError('Test error message');

    expect(error.name).toBe('TokenError');
    expect(error.message).toBe('Test error message');
    expect(error.code).toBe('TOKEN_ERROR');
    expect(error.statusCode).toBe(401);
  });

  it('should create invalid credentials error', () => {
    const error = TokenError.invalidCredentials();

    expect(error.name).toBe('TokenError');
    expect(error.message).toBe('Las credenciales proporcionadas son inválidas');
    expect(error.code).toBe('TOKEN_ERROR');
    expect(error.statusCode).toBe(401);
  });

  it('should create authentication failed error', () => {
    const error = TokenError.authenticationFailed();

    expect(error.name).toBe('TokenError');
    expect(error.message).toBe('Error al autenticar el usuario');
    expect(error.code).toBe('TOKEN_ERROR');
    expect(error.statusCode).toBe(401);
  });

  it('should be instance of Error and DomainError', () => {
    const error = new TokenError('Test error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TokenError);
  });
});
