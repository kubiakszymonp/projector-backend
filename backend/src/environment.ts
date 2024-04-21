export const environment = {
  DATABASE_URL: __dirname + '../../../database/db.sqlite',
  DATABASE_SYNCHRONIZE: true,
  DATABASE_LOGGING: true,
  DROP_SCHEMA: false,
  LOAD_TEXT_UNITS: false,
  PORT: 3001,
  FILE_UPLOAD_URL: 'http://localhost:3001/upload',
};
