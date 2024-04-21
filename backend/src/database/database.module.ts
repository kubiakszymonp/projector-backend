import { Module } from '@nestjs/common';
import { databaseConnectionProvider } from './database.providers';
import { RepositoryFactory } from './repository.factory';
import { DataSource } from 'typeorm';

const repositoryFactory = {
  provide: RepositoryFactory,
  useFactory: (dataSource: DataSource) => {
    return dataSource;
  },
  inject: ['DATA_SOURCE'],
};

@Module({
  providers: [databaseConnectionProvider, repositoryFactory],
  exports: [databaseConnectionProvider, repositoryFactory],
})
export class DatabaseModule {}
