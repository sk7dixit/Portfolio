import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(__dirname, '../data/settings.json');

// Helper to load settings safely
const loadSettings = () => {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      // Ensure directory exists
      fs.mkdirSync(path.dirname(settingsFilePath), { recursive: true });
      // Write default settings
      const defaultSettings = {
        theme: 'dark',
        animations: true,
        blurIntensity: 8,
        notificationSounds: true,
        telemetryMode: 'active',
        smtp: {
          provider: 'Resend',
          host: 'smtp.resend.com',
          port: 465,
          user: 'resend',
          status: 'CONNECTED'
        },
        storage: {
          provider: 'Cloudinary',
          bucketName: 'portfolio-uploads',
          status: 'ACTIVE'
        },
        security: {
          sessionTimeout: 60,
          adminAuth: 'JWT',
          ipRestrictions: false,
          loginAlerts: true
        },
        ai: {
          leadSensitivity: 75,
          aiResponseDepth: 'advanced',
          autoTagging: true,
          signalClassification: true
        },
        system: {
          environment: 'development',
          frontendUrl: 'http://localhost:3001',
          backendHealth: 'HEALTHY',
          region: 'ap-south-1'
        }
      };
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
      return defaultSettings;
    }
    const raw = fs.readFileSync(settingsFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('loadSettings error:', e);
    return {};
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    const data = loadSettings();
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error('getSettings error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const current = loadSettings();
    // Perform a deep merge or simple overwrite
    const updated = { ...current, ...req.body };
    fs.writeFileSync(settingsFilePath, JSON.stringify(updated, null, 2), 'utf-8');
    return res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    console.error('updateSettings error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
