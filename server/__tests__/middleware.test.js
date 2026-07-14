import { jest } from '@jest/globals';
import { validateRequest, parseMultipartData } from '../middleware/validateRequest.js';
import { requireAuth } from '../middleware/auth.js';
import { catchAsync, errorHandler } from '../middleware/errorHandler.js';
import AppError from '../utils/AppError.js';
import Joi from 'joi';

// ---------------------------------------------------------------------------
// parseMultipartData
// ---------------------------------------------------------------------------
describe('parseMultipartData', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('parses JSON string in req.body.data and merges into req.body', () => {
    req.body = { data: JSON.stringify({ dailyRate: 100, carId: 'abc' }) };
    parseMultipartData(req, res, next);
    expect(req.body).toEqual({ dailyRate: 100, carId: 'abc' });
    expect(next).toHaveBeenCalled();
  });

  it('calls next without modification when body.data is not a string', () => {
    req.body = { someOtherField: 'value' };
    parseMultipartData(req, res, next);
    expect(req.body).toEqual({ someOtherField: 'value' });
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 when body.data contains invalid JSON', () => {
    req.body = { data: '{invalid json' };
    parseMultipartData(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Invalid JSON') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('handles empty JSON object', () => {
    req.body = { data: '{}' };
    parseMultipartData(req, res, next);
    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// validateRequest
// ---------------------------------------------------------------------------
describe('validateRequest', () => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().positive().required(),
  });

  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('calls next when body is valid', () => {
    req.body = { name: 'Alice', age: 30 };
    validateRequest(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with all error messages when body is invalid', () => {
    req.body = {};
    validateRequest(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.arrayContaining([expect.any(String)]) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('collects multiple validation errors (abortEarly false)', () => {
    req.body = { name: '', age: -5 };
    validateRequest(schema)(req, res, next);
    const callArg = res.json.mock.calls[0][0];
    expect(callArg.errors.length).toBeGreaterThan(1);
  });

  it('returns 400 when a field has wrong type', () => {
    req.body = { name: 'Alice', age: 'not-a-number' };
    validateRequest(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ---------------------------------------------------------------------------
// requireAuth
// ---------------------------------------------------------------------------
describe('requireAuth', () => {
  let req, res, next;

  beforeEach(() => {
    req = { session: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('calls next when session is authenticated', () => {
    req.session = { isAuthenticated: true };
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 401 when session is missing', () => {
    req.session = null;
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when isAuthenticated is false', () => {
    req.session = { isAuthenticated: false };
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when isAuthenticated is absent', () => {
    req.session = {};
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

// ---------------------------------------------------------------------------
// catchAsync
// ---------------------------------------------------------------------------
describe('catchAsync', () => {
  it('calls next with error when the wrapped async function throws', async () => {
    const error = new Error('async boom');
    const handler = catchAsync(async () => { throw error; });
    const next = jest.fn();
    await handler({}, {}, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('does not call next with error when the async function resolves', async () => {
    const handler = catchAsync(async (req, res) => res.json({ ok: true }));
    const res = { json: jest.fn() };
    const next = jest.fn();
    await handler({}, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

// ---------------------------------------------------------------------------
// AppError
// ---------------------------------------------------------------------------
describe('AppError', () => {
  it('sets statusCode, status=fail for 4xx, isOperational=true', () => {
    const err = new AppError('Not found', 404);
    expect(err.statusCode).toBe(404);
    expect(err.status).toBe('fail');
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe('Not found');
  });

  it('sets status=error for 5xx', () => {
    const err = new AppError('Server error', 500);
    expect(err.status).toBe('error');
  });

  it('is an instance of Error', () => {
    expect(new AppError('test', 400)).toBeInstanceOf(Error);
  });
});

// ---------------------------------------------------------------------------
// errorHandler (global Express error middleware)
// ---------------------------------------------------------------------------
describe('errorHandler', () => {
  const makeRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  beforeEach(() => {
    process.env.NODE_ENV = 'production';
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  it('sends operational error message and status code in production', () => {
    const err = new AppError('Forbidden', 403);
    const res = makeRes();
    errorHandler(err, { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Forbidden' })
    );
  });

  it('hides error details for non-operational errors in production', () => {
    const err = new Error('Internal programming bug');
    const res = makeRes();
    errorHandler(err, { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    const body = res.json.mock.calls[0][0];
    expect(body.message).not.toContain('programming bug');
  });

  it('handles CastError (invalid MongoDB ObjectId) as 400', () => {
    const err = Object.assign(new Error('Cast error'), {
      name: 'CastError',
      path: '_id',
      value: 'bad-id',
    });
    const res = makeRes();
    errorHandler(err, { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handles duplicate key error (code 11000) as 400', () => {
    const err = Object.assign(new Error('Duplicate'), {
      code: 11000,
      keyValue: { matricule: 'AB-123' },
    });
    const res = makeRes();
    errorHandler(err, { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toContain('matricule');
  });

  it('handles Mongoose ValidationError as 400', () => {
    const err = Object.assign(new Error('Validation failed'), {
      name: 'ValidationError',
      errors: {
        make: { message: 'make is required' },
        model: { message: 'model is required' },
      },
    });
    const res = makeRes();
    errorHandler(err, { originalUrl: '/test', method: 'GET', ip: '127.0.0.1' }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toContain('make is required');
  });
});
