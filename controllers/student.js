import { Student } from '../models/student.js'
import { Tag } from '../models/tag.js'
import { Avatar } from '../models/avatar.js'
import { Attendance } from '../models/attendance.js'
import { startOfDay, endOfDay } from 'date-fns'
import { Op } from 'sequelize'

export const createStudent = async (student) => {
  try {
    const { id, firstName, lastName, middleName, course, year, section } =
      student
    const result = await Student.create({
      id: id,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      course: course,
      year: year,
      section: section,
    })
    //console.log(`Student with id ${id} was created...`)
    return result
  } catch (error) {
    //console.error('Student creation failed: ', error)
    throw error
  }
}

export const createTag = async (tag) => {
  try {
    const result = await Tag.create({
      tag: tag,
    })
    return result
  } catch (error) {
    throw error
  }
}

export const createAvatar = async (avatar) => {
  try {
    const result = await Avatar.create({
      fileName: avatar.fileName,
      path: avatar.path,
    })
    return result
  } catch (error) {
    throw error
  }
}

export const findStudentByTag = async (tag) => {
  try {
    const result = await Student.findAll({
      include: [
        { model: Avatar },
        {
          model: Tag,
          where: { tag: tag.toString().trim() },
        },
        {
          model: Attendance,
        },
      ],
    })
    return result
  } catch (error) {
    throw error
  }
}

export const createAttendance = async (attendance) => {
  try {
    const result = await Attendance.create({
      isPresent: attendance,
    })
    return result
  } catch (error) {
    throw error
  }
}

export const findCourseYearSection = async () => {
  try {
    const result = await Student.findAll({
      group: ['course', 'year', 'section'],
      include: [
        {
          model: Attendance,
          required: false,
          where: {
            createdAt: {
              [Op.lt]: endOfDay(new Date()),
              [Op.gt]: startOfDay(new Date()),
            },
          },
        },
      ],
    })
    return result
  } catch (error) {
    throw error
  }
}

export const findByCourseYearSection = async (student) => {
  try {
    const { course, year, section } = student
    const result = await Student.findAll({
      where: {
        [Op.and]: [{ course: course }, { year: year }, { section: section }],
      },
      include: [
        {
          model: Attendance,
          required: false,
          where: {
            createdAt: {
              [Op.lt]: endOfDay(new Date()),
              [Op.gt]: startOfDay(new Date()),
            },
          },
        },
      ],
    })
    return result
  } catch (error) {
    throw error
  }
}

export const listAllStudent = async () => {
  try {
    const result = await Student.findAll({
      include: [
        {
          model: Attendance,
          required: false,
          where: {
            createdAt: {
              [Op.lt]: endOfDay(new Date()),
              [Op.gt]: startOfDay(new Date()),
            },
          },
        },
      ],
    })
    return result
  } catch (error) {
    throw error
  }
}

export const findStudentByID = async (id) => {
  try {
    const result = await Student.findOne({ where: { id: id } })
    return result
  } catch (error) {
    throw error
  }
}

export const findTag = async (tag) => {
  try {
    const result = await Tag.findOne({ where: { tag: tag } })
    return result
  } catch (error) {
    throw error
  }
}
