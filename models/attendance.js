import { sequelize } from '../db.js'
import { DataTypes } from 'sequelize'
import { Student } from './student.js'

export const Attendance = sequelize.define('attendance', {
  isPresent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
})

Student.hasMany(Attendance)
Attendance.belongsTo(Student)
