import { applyDecorators } from '@nestjs/common';
import { ApiResponse as SwaggerApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Standard API documentation decorators
 */
export function ApiDocumentation(tags: string[], _description?: string) {
  return applyDecorators(ApiTags(...tags));
}

/**
 * Standard success response
 */
export function ApiOkResponse(description?: string) {
  return SwaggerApiResponse({
    status: 200,
    description: description || 'Operation successful',
  });
}

/**
 * Standard created response
 */
export function ApiCreatedResponse(description?: string) {
  return SwaggerApiResponse({
    status: 201,
    description: description || 'Resource created successfully',
  });
}

/**
 * Standard not found response
 */
export function ApiNotFoundResponse(description?: string) {
  return SwaggerApiResponse({
    status: 404,
    description: description || 'Resource not found',
  });
}

/**
 * Standard bad request response
 */
export function ApiBadRequestResponse(description?: string) {
  return SwaggerApiResponse({
    status: 400,
    description: description || 'Invalid request',
  });
}

/**
 * Standard unauthorized response
 */
export function ApiUnauthorizedResponse(description?: string) {
  return SwaggerApiResponse({
    status: 401,
    description: description || 'Unauthorized',
  });
}

/**
 * Standard forbidden response
 */
export function ApiForbiddenResponse(description?: string) {
  return SwaggerApiResponse({
    status: 403,
    description: description || 'Forbidden',
  });
}

/**
 * Requires JWT authentication
 */
export function RequireAuth() {
  return applyDecorators(ApiBearerAuth());
}
