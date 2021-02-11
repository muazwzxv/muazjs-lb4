import {inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.uuid,
  UserRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {
    super(User, dataSource);
  }

  async findCredentials(
    userId: typeof User.prototype.uuid,
  ): Promise<User | undefined> {
    try {
      return await this.userRepository.findById(userId);
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') return undefined;
      throw err;
    }
  }
}
