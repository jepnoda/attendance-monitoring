import { sequelize } from '../db.js'
import { DataTypes } from 'sequelize'

export const Student = sequelize.define('student', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middleName: {
    type: DataTypes.STRING,
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  section: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
})