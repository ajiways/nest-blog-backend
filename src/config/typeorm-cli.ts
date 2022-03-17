import { getOrmConfig } from './typeorm';
import { join } from 'path';

export default [
  {
    name: 'migrations:generate',
    ...getOrmConfig(),
    entities: [join(__dirname, '..', '/*.entity.{js,ts}')],
  },
  {
    name: 'migrations:create-run-revert',
    ...getOrmConfig(),
    migrations: [join(__dirname, '..', '/migrations')],
  },
];
