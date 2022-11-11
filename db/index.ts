import { DataSource } from 'typeorm';
import { Team } from './team';
import CONSTANTS from '../config/constants';

const { MONGO_URI } = CONSTANTS;

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: MONGO_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
  entities: [Team],
  migrations: [],
  subscribers: [],
});

export const connectDB = async () => {
  if (AppDataSource.isInitialized) return;
  await AppDataSource.initialize();
};
