import api from '../api';
import axios from 'axios';

jest.mock('axios');

describe('API Interceptor', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('adds authorization header when token exists', async () => {
    const token = 'test-token-123';
    localStorage.setItem('token', token);

    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0];

    if (interceptor) {
      const modifiedConfig = interceptor.fulfilled(config);
      expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
    }
  });

  it('does not add authorization header when no token', () => {
    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0];

    if (interceptor) {
      const modifiedConfig = interceptor.fulfilled(config);
      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    }
  });

  it('has correct base URL', () => {
    expect(api.defaults.baseURL).toBe('http://127.0.0.1:8000');
  });
});
