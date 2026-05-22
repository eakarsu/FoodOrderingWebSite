import express from 'express';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
      mediaSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  } : false,
  crossOriginEmbedderPolicy: false
}));

// Enable compression
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://www.your-domain.com']
    : true,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'ServiceHub AI API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/kitchen-capacity/score', (req, res) => {
  const body = req.body || {};
  const orders = Number(body.open_orders || 0);
  const prep = Number(body.avg_prep_minutes || 10);
  const cooks = Number(body.active_cooks || 1);
  const backlog = Number(body.delivery_backlog || 0);
  const windowMinutes = Number(body.rush_window_minutes || 60);
  const requiredCookMinutes = orders * prep;
  const availableCookMinutes = cooks * windowMinutes;
  const utilization = requiredCookMinutes / Math.max(availableCookMinutes, 1);
  const score = Math.max(0, Math.min(100, Math.round(100 - utilization * 45 - backlog * 2)));
  res.json({
    capacity_score: score,
    band: score >= 75 ? 'open' : score >= 50 ? 'throttle' : 'pause new orders',
    utilization: Number(utilization.toFixed(2)),
    actions: [
      utilization > 1 ? 'Pause low-margin items until rush clears.' : 'Keep menu availability open.',
      backlog > 8 ? 'Move driver handoff to priority queue.' : 'Delivery backlog is manageable.',
      cooks < 3 ? 'Call in cross-trained prep support.' : 'Cook coverage is adequate.',
    ],
    generated_at: new Date().toISOString(),
  });
});

// Serve static files from the dist directory with proper MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set proper MIME types
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Handle client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 ServiceHub AI server running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check available at: http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('⏰ Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export default app;
