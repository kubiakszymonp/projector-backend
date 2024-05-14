const devWindows = {
  DATABASE_URL: __dirname + '../../../database/db.sqlite',
  DATABASE_SYNCHRONIZE: true,
  DATABASE_LOGGING: false,
  DROP_SCHEMA: false,
  LOAD_TEXT_UNITS: false,
  PORT: 3001,
  FILE_UPLOAD_PATH: __dirname + '../../../uploads/',
  CERT_PATH: '../cert/cert.pem',
  KEY_PATH: '../cert/key.pem',
  ENABLE_HTTPS: true,
  PROD: false,
  FFMPEG_PATH: 'ffmpeg',
  FFPROBE_PATH: 'ffprobe',
};

const deploy = {
  DATABASE_URL: __dirname + '../../../database/db.sqlite',
  DATABASE_SYNCHRONIZE: true,
  DATABASE_LOGGING: false,
  DROP_SCHEMA: false,
  LOAD_TEXT_UNITS: false,
  PORT: 3001,
  FILE_UPLOAD_PATH: __dirname + '../../../uploads/',
  CERT_PATH: '../cert/cert.pem',
  KEY_PATH: '../cert/key.pem',
  ENABLE_HTTPS: false,
  PROD: true,
  FFMPEG_PATH: '/home/ec2-user/ffmpeg-release-amd64-static/ffmpeg',
  FFPROBE_PATH: '/home/ec2-user/ffmpeg-release-amd64-static/ffprobe',
};

export const ENVIRONMENT: {
  DATABASE_URL: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_LOGGING: boolean;
  DROP_SCHEMA: boolean;
  LOAD_TEXT_UNITS: boolean;
  PORT: number;
  FILE_UPLOAD_PATH: string;
  CERT_PATH: string;
  KEY_PATH: string;
  ENABLE_HTTPS: boolean;
  PROD: boolean;
  FFMPEG_PATH: string;
  FFPROBE_PATH: string;
  JWT_SECRET: string;
} = { ...process.env, ...devWindows } as any;