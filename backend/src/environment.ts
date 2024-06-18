const devWindows = {
  FILE_UPLOAD_PATH: "C:\\Users\\kubia\\Desktop\\dev\\projector-backend\\upload",
  CERT_PATH: 'C:\\Users\\kubia\\Desktop\\dev\\projector-backend\\cert\\cert.pem',
  KEY_PATH: 'C:\\Users\\kubia\\Desktop\\dev\\projector-backend\\cert\\key.pem',
  JWT_SECRET: '5b56bvn9053jvq34v43rvc4ewckewr90vu2894uVU40CUWEDOPKPE93R90V20403ir0v2309T698419V94-TVQREFJAOP4TBAUP985Y',

  // DATABASE
  DATABASE_URL: "C:\\Users\\kubia\\Desktop\\dev\\projector-backend\\database\\db.sqlite",
  DATABASE_SYNCHRONIZE: true,
  DATABASE_LOGGING: true,
  DROP_SCHEMA: true,

  // SERVER
  PORT: 3001,
  ENABLE_HTTPS: true,

  // SEEDING
  ROOT_USER_EMAIL: 'admin@admin.com',
  ROOT_USER_PASSWORD: 'admin',
  ORGANIZATION_UUID: '1',

  // MODULES
  LOAD_TEXTS_MODULE: true,
  LOAD_PROJECTOR_MODULE: true,
  LOAD_ORGANIZATION_MODULE: true,

  CAN_APPLY_BACKUP: true,
  REQUIRE_JWT: true,
  JWT_ORGANIZATION_ID: 1
};


export const ENVIRONMENT: {
  DATABASE_URL: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_LOGGING: boolean;
  DROP_SCHEMA: boolean;
  PORT: number;
  FILE_UPLOAD_PATH: string;
  CERT_PATH: string;
  KEY_PATH: string;
  ENABLE_HTTPS: boolean;
  JWT_SECRET: string;
  ROOT_USER_EMAIL: string;
  ROOT_USER_PASSWORD: string;
  ORGANIZATION_UUID: string;
  LOAD_TEXTS_MODULE: boolean,
  LOAD_PROJECTOR_MODULE: boolean,
  LOAD_ORGANIZATION_MODULE: boolean,
  CAN_APPLY_BACKUP: boolean,
  REQUIRE_JWT: boolean,
  JWT_ORGANIZATION_ID: number
} = { ...process.env, ...devWindows } as any;