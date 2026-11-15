import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Health & Readiness Probes', () => {
  const app = createApp();

  it('GET /api/v1/health should return 200 OK and status operational', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.service).toBe('spendx-backend');
  });

  it('GET /api/v1/health/ready should return 200 OK and readiness telemetry', async () => {
    const res = await request(app).get('/api/v1/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('READY');
    expect(res.body.data).toHaveProperty('memory');
    expect(res.body.data).toHaveProperty('scheduler');
  });
});
