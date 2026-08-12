import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/courses.routes.js';
import eventRoutes from './routes/events.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import aiRoutes from './routes/ai.routes.js';
import devRoutes from './routes/dev.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Cross-Origin Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CampusConnect Backend API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/dev', devRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 CampusConnect Express server running on port ${PORT}`);
  });
}

export default app;
