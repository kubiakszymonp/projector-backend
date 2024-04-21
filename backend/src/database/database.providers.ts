import { environment } from 'src/environment';
import { DataSource } from 'typeorm';

export const databaseConnectionProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'sqlite',
      // relative path to the database file
      database: environment.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      dropSchema: environment.DROP_SCHEMA,
    });

    return dataSource.initialize();
  },
};
