const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to load services data
function loadServices() {
  try {
    const dataPath = path.join(__dirname, 'data', 'services.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error loading services.json:', error);
    return [];
  }
}

// 1. Home Route
app.get('/', (req, res) => {
  const allServices = loadServices();
  // We'll pass the first 6 services for the preview on the homepage
  const servicesPreview = allServices.slice(0, 6);
  res.render('index', { 
    services: servicesPreview,
    title: 'D Cyber Office | Healthcare BPO & Medical Billing Solutions'
  });
});

// 2. Services Page
app.get('/services', (req, res) => {
  const allServices = loadServices();
  res.render('services', { 
    services: allServices,
    title: 'Our BPO Services | D Cyber Office'
  });
});

// 3. Dynamic Service Detail Page
app.get('/services/:slug', (req, res) => {
  const allServices = loadServices();
  const service = allServices.find(s => s.slug === req.params.slug);
  
  if (!service) {
    return res.redirect('/services');
  }
  
  res.render('service-detail', { 
    service: service,
    allServices: allServices,
    title: `${service.name} | D Cyber Office BPO`
  });
});

// 4. Contact Page
app.get('/contact', (req, res) => {
  const allServices = loadServices();
  res.render('contact', { 
    services: allServices,
    title: 'Contact Us | D Cyber Office BPO'
  });
});
// 5. Legal Pages
app.get('/privacy', (req, res) => {
  res.render('privacy', { title: 'Privacy Policy | D Cyber Office BPO' });
});

app.get('/terms', (req, res) => {
  res.render('terms', { title: 'Terms of Service | D Cyber Office BPO' });
});

app.get('/hipaa', (req, res) => {
  res.render('hipaa', { title: 'HIPAA Notice & Compliance | D Cyber Office BPO' });
});
// Start Express Server (only when run directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`D Cyber Office server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
