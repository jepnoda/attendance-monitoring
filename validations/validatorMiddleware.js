import { body, oneOf } from 'express-validator'
import { findStudentByID, findTag } from '../controllers/student.js'

const checkUserExists = async (id) => {
  const student = await findStudentByID(id)
  if (student) {
    throw new Error('Student already registered.')
  }
}

const checkTagExists = async (uid) => {
  const tag = await findTag(uid)
  if (tag) {
    throw new Error('Tag already in use.')
  }
}

export const studentValidator = [
  body('student_id', 'Student ID cannot be empty.').notEmpty(),
  body('student_id', 'Student ID must be Number.').isInt(),
  body('card_uid', 'Card UID cannot be empty.').notEmpty(),
  body('card_uid', 'Card UID must be Alphanumeric.').isAlphanumeric(),
  body('firstName', 'First Name cannot be empty.').notEmpty(),
  body('firstName', 'First Name must be alphabet.').matches(/^[a-zA-Z ]+$/),
  body('lastName', 'Last Name cannot be empty.').notEmpty(),
  body('lastName', 'Last Name must be alphabet.').matches(/^[a-zA-Z ]+$/),
  oneOf(
    [
      body('middleName', 'Middle Name must be alphabet.').matches(
        /^[a-zA-Z ]+$/
      ),
      body('middleName', 'Middle Name must be alphabet.').isEmpty(),
    ],
    { message: 'Middle Name must be alphabet.' }
  ),
  body('course', 'Course cannot be empty.').notEmpty(),
  body('course', 'Course must be alphabet.').isAlpha(),
  body('year', 'Year cannot be empty.').notEmpty(),
  body('year', 'Year must be Number.').isInt(),
  body('section', 'Section cannot be empty.').notEmpty(),
  body('section', 'Section must be Number.').isInt(),

  body('student_id').custom(async (value) => {
    await checkUserExists(value)
  }),
  body('card_uid').custom(async (value) => {
    await checkTagExists(value)
  }),
]
