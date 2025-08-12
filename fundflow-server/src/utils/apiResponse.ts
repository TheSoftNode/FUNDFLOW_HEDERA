import { Response } from 'express';

export class ApiResponse {
  /**
   * Send success response
   */
  static success(
    res: Response,
    message: string,
    data?: any,
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: any
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        code: statusCode,
        details
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send validation error response
   */
  static validationError(
    res: Response,
    message: string,
    errors: any[]
  ): Response {
    return res.status(400).json({
      success: false,
      message,
      error: {
        code: 400,
        type: 'VALIDATION_ERROR',
        details: errors
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): Response {
    return res.status(401).json({
      success: false,
      message,
      error: {
        code: 401,
        type: 'UNAUTHORIZED'
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send forbidden response
   */
  static forbidden(
    res: Response,
    message: string = 'Forbidden access'
  ): Response {
    return res.status(403).json({
      success: false,
      message,
      error: {
        code: 403,
        type: 'FORBIDDEN'
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send not found response
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return res.status(404).json({
      success: false,
      message,
      error: {
        code: 404,
        type: 'NOT_FOUND'
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send conflict response
   */
  static conflict(
    res: Response,
    message: string = 'Resource conflict'
  ): Response {
    return res.status(409).json({
      success: false,
      message,
      error: {
        code: 409,
        type: 'CONFLICT'
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send too many requests response
   */
  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests'
  ): Response {
    return res.status(429).json({
      success: false,
      message,
      error: {
        code: 429,
        type: 'RATE_LIMIT_EXCEEDED'
      },
      timestamp: new Date().toISOString()
    });
  }
}
