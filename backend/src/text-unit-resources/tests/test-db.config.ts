import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDbConfig: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: './test-db.sqlite3',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    dropSchema: true,
};


export const TEST_TIMEOUT = 100_000_000;