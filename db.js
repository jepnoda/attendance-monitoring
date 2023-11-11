import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './server/attendance-monitoring.db',
  logging: false,
})

try {
  await sequelize.authenticate()
  console.log('Database connection has been established successfully: ',sequelize.getDialect())
} catch (error) {
  console.error('Unable to connect to the database:', error)
}
