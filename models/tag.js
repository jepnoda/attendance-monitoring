import { sequelize } from '../db.js'
import { DataTypes } from 'sequelize'
import { Student } from './student.js'

export const Tag = sequelize.define('tag', {
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
})

Student.hasOne(Tag)
Tag.belongsTo(Student)