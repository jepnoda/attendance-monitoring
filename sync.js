import { Student } from './models/student.js'
import { Tag } from './models/tag.js'
import { Attendance } from './models/attendance.js'
import { Avatar } from './models/avatar.js'
;(async () => {
  try {
    await Student.sync({ force: true })
    console.log(`The ${Student.getTableName()} was just (re)created!`)
    await Avatar.sync({ force: true })
    console.log(`The ${Avatar.getTableName()} was just (re)created!`)
    await Tag.sync({ force: true })
    console.log(`The ${Tag.getTableName()} was just (re)created!`)
    await Attendance.sync({ force: true })
    console.log(`The ${Attendance.getTableName()} was just (re)created!`)
  } catch (error) {
    console.error('Error syncing models:', error)
  }
})()
