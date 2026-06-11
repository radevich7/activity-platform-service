import { ConfigParams } from 'express-openid-connect';

const requiredAuth0EnvKeys = [
  'SECRET',
  'BASE_URL',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'ISSUER_BASE_URL',
] as const;

type RequiredAuth0EnvKey = (typeof requiredAuth0EnvKeys)[number];

type Auth0Environment = Record<RequiredAuth0EnvKey, string>;

const getAuth0Environment = (): Partial<Auth0Environment> =>
  requiredAuth0EnvKeys.reduce<Partial<Auth0Environment>>((environment, key) => {
    const value = process.env[key];

    if (value) {
      environment[key] = value;
    }

    return environment;
  }, {});

const auth0Environment = getAuth0Environment();

export const missingAuth0EnvVars = requiredAuth0EnvKeys.filter(
  (key) => !auth0Environment[key]
);

export const isAuth0Configured = missingAuth0EnvVars.length === 0;

export const getAuth0Config = (): ConfigParams | null => {
  if (!isAuth0Configured) {
    return null;
  }

  const environment = auth0Environment as Auth0Environment;

  const auth0Config: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    errorOnRequiredAuth: true,
    secret: environment.SECRET,
    baseURL: environment.BASE_URL,
    clientID: environment.CLIENT_ID,
    clientSecret: environment.CLIENT_SECRET,
    issuerBaseURL: environment.ISSUER_BASE_URL,
    routes: {
      login: '/auth/login',
      logout: '/auth/logout',
      callback: '/auth/callback',
      postLogoutRedirect: '/auth/status',
    },
    session: {
      rolling: true,
      rollingDuration: 60 * 60 * 24,
      absoluteDuration: 60 * 60 * 24 * 7,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    },
  };

  if (process.env.AUDIENCE) {
    auth0Config.authorizationParams = {
      response_type: 'code',
      audience: process.env.AUDIENCE,
      scope: process.env.AUTH0_SCOPE || 'openid profile email',
    };
  }

  return auth0Config;
};
