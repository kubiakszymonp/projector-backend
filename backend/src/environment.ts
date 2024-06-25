const devWindows = {
  FILE_UPLOAD_PATH: "C:\\Users\\kubia\\Desktop\\dev\\projector-backend\\upload",
  JWT_SECRET: '5b56bvn9053jvq34v43rvc4ewckewr90vu2894uVU40CUWEDOPKPE93R90V20403ir0v2309T698419V94-TVQREFJAOP4TBAUP985Y',

  // DATABASE
  DATABASE_URL: "C:\\Users\\kubia\\Desktop\\dev\\projector-backend\\database\\db.sqlite",
  DATABASE_SYNCHRONIZE: true,
  DATABASE_LOGGING: false,
  DROP_SCHEMA: true,

  // SERVER
  PORT: 3001,

  // SEEDING
  ROOT_USER_EMAIL: 'admin@admin.com',
  ROOT_USER_PASSWORD: 'admin',
  ORGANIZATION_UUID: '1',

  // MODULES
  LOAD_TEXTS_MODULE: true,
  LOAD_PROJECTOR_MODULE: true,
  LOAD_ORGANIZATION_MODULE: true,
};


export const ENVIRONMENT: {
  DATABASE_URL: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_LOGGING: boolean;
  DROP_SCHEMA: boolean;
  PORT: number;
  FILE_UPLOAD_PATH: string;
  ENABLE_HTTPS: boolean;
  JWT_SECRET: string;
  ROOT_USER_EMAIL: string;
  ROOT_USER_PASSWORD: string;
  ORGANIZATION_UUID: string;
  LOAD_TEXTS_MODULE: boolean,
  LOAD_PROJECTOR_MODULE: boolean,
  LOAD_ORGANIZATION_MODULE: boolean,
} = { ...devWindows, ...process.env } as any;