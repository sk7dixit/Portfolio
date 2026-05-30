import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import profileRoutes from './routes/profileRoutes';
import projectRoutes from './routes/projectRoutes';
import skillRoutes from './routes/skillRoutes';
import themeRoutes from './routes/themeRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import certificateRoutes from './routes/certificateRoutes';
import internshipRoutes from './routes/internshipRoutes';
import ksExperienceRoutes from './routes/ksExperienceRoutes';
import ksCertificateRoutes from './routes/ksCertificateRoutes';
import ksCommunicationRoutes from './routes/ksCommunicationRoutes';
import sdCommunicationRoutes from './routes/sdCommunicationRoutes';
import msBrandIdentityRoutes from './routes/msBrandIdentityRoutes';
import msGlobalExperienceRoutes from './routes/msGlobalExperienceRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { seedDatabase } from './config/seed';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }
});

// Expose Socket.IO instance globally toExpress controllers
app.set('io', io);

// Configure Socket.IO real-time synchronization
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('portfolio:join', (slug: string) => {
    socket.join(`portfolio:${slug}`);
    console.log(`👤 Client ${socket.id} joined room: portfolio:${slug}`);
  });

  socket.on('skills:update', (payload: { slug: string; skillsSection: any }) => {
    console.log(`⚡ Real-time skills update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('skills:updated', payload.skillsSection);
  });

  socket.on('philosophy:update', (payload: { slug: string; philosophyStrip: any }) => {
    console.log(`⚡ Real-time philosophy update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('philosophy:updated', payload.philosophyStrip);
  });

  socket.on('profile:update', (payload: { slug: string; profile: any }) => {
    console.log(`⚡ Real-time profile update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('profile:updated', payload.profile);
  });

  socket.on('projects:update', (payload: { slug: string; projectsSection?: any; projects?: any }) => {
    console.log(`⚡ Real-time projects update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('projects:updated', payload);
  });

  socket.on('certificates:update', (payload: { slug: string; certificatesSection?: any; certificates?: any }) => {
    console.log(`⚡ Real-time certificates update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('certificates:updated', payload);
  });

  socket.on('achievements:update', (payload: { slug: string; achievementsSection: any }) => {
    console.log(`⚡ Real-time achievements update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('achievements:updated', payload.achievementsSection);
  });

  socket.on('journey:update', (payload: { slug: string; journeySection: any }) => {
    console.log(`⚡ Real-time journey update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('journey:updated', payload.journeySection);
  });

  socket.on('contact:update', (payload: { slug: string; contactSection: any }) => {
    console.log(`⚡ Real-time contact update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('contact:updated', payload.contactSection);
  });

  socket.on('internships:update', (payload: { slug: string; internshipsSection?: any; internships?: any }) => {
    console.log(`⚡ Real-time internships update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('internships:updated', payload);
  });

  socket.on('experience_ks:update', (payload: { slug: string; experiences?: any }) => {
    console.log(`⚡ Real-time KS experience update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('experience_ks:updated', payload);
  });

  socket.on('certificates_ks:update', (payload: { slug: string; certificates?: any }) => {
    console.log(`⚡ Real-time KS certificates update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('certificates_ks:updated', payload);
  });

  socket.on('communication_ks:update', (payload: { slug: string; contactCMS?: any; messages?: any }) => {
    console.log(`⚡ Real-time KS communication update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('communication_ks:updated', payload);
  });

  socket.on('communication_sd:update', (payload: { slug: string; contactCMS?: any; messages?: any }) => {
    console.log(`⚡ Real-time SD communication update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('communication_sd:updated', payload);
  });

  socket.on('brand_identity_ms:update', (payload: { slug: string; brandIdentity?: any }) => {
    console.log(`⚡ Real-time MS brand identity update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('brand_identity_ms:updated', payload);
  });

  socket.on('global_experience_ms:update', (payload: { slug: string; globalExperience?: any }) => {
    console.log(`⚡ Real-time MS global experience update broadcast for room portfolio:${payload.slug}`);
    io.to(`portfolio:${payload.slug}`).emit('global_experience_ms:updated', payload);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});


// Enable CORS with support for credentials
app.use(cors({
  origin: '*', // We allow all connections for simplicity in local dev, but in production, we restrict
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/ks/experience', ksExperienceRoutes);
app.use('/api/ks/certificates', ksCertificateRoutes);
app.use('/api/ks/communication', ksCommunicationRoutes);
app.use('/api/sd/communication', sdCommunicationRoutes);
app.use('/api/ms/brand-identity', msBrandIdentityRoutes);
app.use('/api/ms/global-experience', msGlobalExperienceRoutes);

app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

httpServer.listen(PORT, async () => {
  console.log(`🚀 Portfolio API Backend running on http://localhost:${PORT}`);
  // Run database auto-seeder
  await seedDatabase();
});

