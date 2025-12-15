import app from '#src/app.js';
import request from 'supertest';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .set('User-Agent', 'Jest Test Runner')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return API is working message', async () => {
      const response = await request(app)
        .get('/api')
        .set('User-Agent', 'Jest Test Runner')
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Acquisitions API is working'
      );
    });
  });

  describe('GET /nonexisting', () => {
    it('should return 404 for non-existing routes', async () => {
      const response = await request(app)
        .get('/nonexisting')
        .set('User-Agent', 'Jest Test Runner')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty(
        'message',
        'The requested resource was not found'
      );
    });
  });
});
