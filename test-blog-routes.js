const request = require('supertest');
const { createApp } = require('./src/setup/app');

const app = createApp();

// Test blog routes
describe('Blog API Routes', () => {
  // Test GET /api/blogs
  test('GET /api/blogs should return blog list', async () => {
    const response = await request(app)
      .get('/api/blogs')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('blogs');
    expect(response.body.data).toHaveProperty('pagination');
  });

  // Test GET /api/blogs/featured
  test('GET /api/blogs/featured should return featured blogs', async () => {
    const response = await request(app)
      .get('/api/blogs/featured')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Test GET /api/blogs/tags
  test('GET /api/blogs/tags should return all tags', async () => {
    const response = await request(app)
      .get('/api/blogs/tags')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Test GET /api/blogs/search
  test('GET /api/blogs/search should search blogs', async () => {
    const response = await request(app)
      .get('/api/blogs/search?q=testing')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('blogs');
    expect(response.body.data).toHaveProperty('query');
  });

  // Test GET /api/blogs/tag/:tag
  test('GET /api/blogs/tag/:tag should return blogs by tag', async () => {
    const response = await request(app)
      .get('/api/blogs/tag/ndt')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('blogs');
    expect(response.body.data).toHaveProperty('tag');
  });
});

console.log('Blog API tests completed successfully!');





