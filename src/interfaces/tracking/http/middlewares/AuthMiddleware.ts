import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { config } from '@app/config/environment';
import { UnauthorizedError } from '@shared/domain/errors';
import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtPayload } from 'jsonwebtoken';

interface DecodedToken {
  header: {
    kid: string;
    alg: string;
  };
  payload: jwt.JwtPayload;
  signature: string;
}

const client = new JwksClient({
  jwksUri: `${config.auth.domain}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  requestHeaders: {}, // empty headers object
  timeout: 30000, // timeout de 30 segundos
});

async function getKey(kid: string): Promise<string> {
  try {
    const key = await client.getSigningKey(kid);
    if (!key) {
      console.error('No se encontró la clave para el kid:', kid);
      throw new UnauthorizedError('No se encontró la clave de verificación');
    }

    return key.getPublicKey();
  } catch (error) {
    console.error('Error obteniendo clave de firma:', error);
    if (error instanceof Error) {
      throw new UnauthorizedError(`Error validando el token: ${error.message}`);
    }
    throw new UnauthorizedError('Error validando el token');
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(
        'No se proporcionó el header de autorización',
      );
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('No se proporcionó el token');
    }

    // Decodificar el token sin verificar para obtener el kid
    const decodedToken = jwt.decode(token, {
      complete: true,
    }) as DecodedToken | null;
    if (!decodedToken || !decodedToken.header.kid) {
      throw new UnauthorizedError('Token inválido');
    }

    // Obtener la clave pública correspondiente al kid
    const publicKey = await getKey(decodedToken.header.kid);

    // Verificar el token con la clave pública
    const cleanDomain = config.auth.domain?.replace('https://', '') || '';
    const cleanAudience = config.auth.audience?.replace('https://', 'https://');

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: cleanAudience,
      issuer: `https://${cleanDomain}/`,
    }) as jwt.JwtPayload;

    // Añadir la información del usuario al request para uso posterior
    console.log(decoded);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    console.error('Error en autenticación:', error);
    throw new UnauthorizedError('Token inválido');
  }
}
