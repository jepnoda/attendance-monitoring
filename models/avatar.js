import { sequelize } from '../db.js'
import { DataTypes } from 'sequelize'
import { Student } from './student.js'

export const Avatar = sequelize.define('avatar', {
  fileName: {
    type: DataTypes.STRING,
  },
  path: {
    type: DataTypes.STRING,
  },
})

Student.hasOne(Avatar)
Avatar.belongsTo(Student)
