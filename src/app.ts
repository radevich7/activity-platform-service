import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import { auth } from 'express-openid-connect';

import AppError from './utils/appError';
import { globalErrorHandler } from './controllers/error.controller';
import { getAuth0Config, isAuth0Configured, missingAuth0EnvVars } from './config/auth0';
import logger from './utils/logger';

// Routes
import publicRoutes from './routes/public.routes';
import authRoutes from './routes/auth.routes';
import providerRoutes from './routes/provider.routes';
import parentRoutes from './routes/parent.routes';
import bookingRoutes from './routes/booking.routes';

const xss = require('xss-clean');

const app = express();

// ─── Trust proxy (required for rate limiter behind Heroku/nginx) ──────────────
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Rate limiter ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// ─── Allowed CORS origins ─────────────────────────────────────────────────────
const getAllowedOrigins = (): string[] => [
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4200',
  'http://localhost:5173',
  'http://127.0.0.1:3000',

  // QA environment
  'http://qa.activity-platform.ca',
  'https://qa.activity-platform.ca',
  'http://app-qa.activity-platform.ca',
  'https://app-qa.activity-platform.ca',

  // Production environment
  'https://activity-platform.ca',
  'https://www.activity-platform.ca',
  'https://app.activity-platform.ca',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (getAllowedOrigins().includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cookie',
    'Set-Cookie',
  ],
  exposedHeaders: ['Set-Cookie'],
};

// ─── 1. Compression ───────────────────────────────────────────────────────────
app.use(compression());

// ─── 2. Security headers ──────────────────────────────────────────────────────
app.use(helmet());

// ─── 3. CORS ──────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── 4. Auth0 session middleware (must come before routes) ────────────────────
const auth0Config = getAuth0Config();

if (auth0Config) {
  app.use(auth(auth0Config));
} else {
  console.warn(`⚠️  Auth0 disabled — missing env vars: ${missingAuth0EnvVars.join(', ')}`);
}

// ─── 5. Body parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── 6. Rate limiting ─────────────────────────────────────────────────────────
app.use('/api', limiter);

// ─── 7. Data sanitization ─────────────────────────────────────────────────────
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ─── 8. HTTP request logging (pino-http) ──────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    // Custom log level per response status
    customLogLevel(_req, res, err) {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    // Serialise only the fields we care about
    customSuccessMessage(req, res) {
      return `${req.method} ${req.url} → ${res.statusCode}`;
    },
    customErrorMessage(req, res, err) {
      return `${req.method} ${req.url} → ${res.statusCode} — ${err.message}`;
    },
  })
);

// ─── 9. CORS preflight debug (development only) ───────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      console.log(`🔧 CORS Preflight from: ${req.headers.origin}`);
    }
    next();
  });
}

// ─── 10. Routes ───────────────────────────────────────────────────────────────
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/bookings', bookingRoutes);

// ─── 11. Unmatched routes ─────────────────────────────────────────────────────
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ─── 12. Global error handler (must be last) ──────────────────────────────────
app.use(globalErrorHandler);

export default app;
