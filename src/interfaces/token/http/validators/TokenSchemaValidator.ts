export const TokenSchemaValidator = {
  token: {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 }
      },
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          id_token: { type: 'string' },
          scope: { type: 'string' },
          expires_in: { type: 'number' },
          token_type: { type: 'string' }
        }
      }
    }
  }
} as const;