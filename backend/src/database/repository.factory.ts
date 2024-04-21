import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class RepositoryFactory {
  getRepository<Entity extends ObjectLiteral>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    target: EntityTarget<Entity>,
    // @ts-expect-error declaration
  ): Repository<Entity> {}
}
