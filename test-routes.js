const express = require('express');
const app = express();

// Mock controller functions for testing
const mockController = {
  getAllStaticTranslations: (req, res) => {
    console.log('✅ getAllStaticTranslations called');
    console.log('URL:', req.url);
    console.log('Path:', req.path);
    res.json({ success: true, message: 'All translations' });
  },
  
  getStaticTranslations: (req, res) => {
    console.log('✅ getStaticTranslations called');
    console.log('URL:', req.url);
    console.log('Path:', req.path);
    console.log('Params:', req.params);
    console.log('Lang param:', req.params.lang);
    res.json({ success: true, message: `Translations for ${req.params.lang}` });
  },
  
  translateSection: (req, res) => {
    console.log('✅ translateSection called');
    console.log('URL:', req.url);
    console.log('Path:', req.path);
    console.log('Params:', req.params);
    console.log('ID param:', req.params.id);
    res.json({ success: true, message: `Section ${req.params.id}` });
  }
};

// Test the exact route order from your app
const router = express.Router();

// Get all static translations
router.get('/static', mockController.getAllStaticTranslations);

// Get static translations for a specific language
router.get('/static/:lang', mockController.getStaticTranslations);

// Get section translations (existing route) - this should be last
router.get('/:id', mockController.translateSection);

app.use('/api/translate', router);

// Test the routes
console.log('🧪 Testing route parameter extraction...\n');

// Simulate requests
const testRoutes = [
  '/api/translate/static',
  '/api/translate/static/en',
  '/api/translate/static/fr',
  '/api/translate/123',
  '/api/translate/static/static' // This should match /static/:lang, not /:id
];

testRoutes.forEach(route => {
  console.log(`\n🔍 Testing: ${route}`);
  const req = { url: route, path: route.replace('/api/translate', '') };
  const res = { json: (data) => console.log('Response:', data) };
  
  // Find matching route
  let matched = false;
  router.stack.forEach(layer => {
    if (layer.route && layer.route.path) {
      const pattern = layer.route.path;
      const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '$');
      if (regex.test(req.path)) {
        console.log(`  Matches route: ${pattern}`);
        matched = true;
        // Extract params manually for testing
        const params = {};
        const pathParts = req.path.split('/');
        const patternParts = pattern.split('/');
        
        patternParts.forEach((part, index) => {
          if (part.startsWith(':')) {
            const paramName = part.slice(1);
            params[paramName] = pathParts[index];
          }
        });
        
        req.params = params;
        console.log(`  Extracted params:`, params);
        
        // Call the handler
        if (pattern === '/static') {
          mockController.getAllStaticTranslations(req, res);
        } else if (pattern === '/static/:lang') {
          mockController.getStaticTranslations(req, res);
        } else if (pattern === '/:id') {
          mockController.translateSection(req, res);
        }
      }
    }
  });
  
  if (!matched) {
    console.log('  ❌ No route matched');
  }
});

console.log('\n✅ Route testing completed!');
