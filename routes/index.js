import express from 'express'
import multer from 'multer'
import path from 'path'
import { format } from 'date-fns'
import { body, validationResult } from 'express-validator'

import {
  createStudent,
  createTag,
  createAvatar,
  findStudentByID,
} from '../controllers/student.js'

import { studentValidator } from '../validations/validatorMiddleware.js'
import { capitalize, uppercase } from '../helpers/string.js'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname)
    const date = format(new Date(), 'yyyy-MM-dd_HH_mm_ss')
    const newFileName = `${req.body.student_id}_${date}${fileExtension}`
    cb(null, newFileName)
  },
})

const upload = multer({ storage: storage })

const router = express.Router()

router.get('/', async (req, res) => {
  res.render('pages/index')
})

router.post(
  '/',
  [upload.single('avatar'), studentValidator],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      console.log(errors.errors)
      if (errors.isEmpty()) {
        const {
          student_id,
          firstName,
          lastName,
          middleName,
          course,
          year,
          section,
          card_uid,
        } = req.body
        const student = await createStudent({
          id: student_id,
          firstName: capitalize(firstName),
          lastName: capitalize(lastName),
          middleName: capitalize(middleName),
          course: uppercase(course),
          year: year,
          section: section,
        })
        const tag = await createTag(uppercase(card_uid))
        await student.setTag(tag)

        if (req.file) {
          const { fileName, path } = req.file
          const avatar = await createAvatar({
            fileName: fileName,
            path: path,
          })
          await student.setAvatar(avatar)
          console.log('Avatar uploaded 🤘')
        } else {
          console.log('No avatar uploaded 🙂')
        }
        res.json({
          success: true,
          data: student,
          message: `Student with id ${student_id} added 😘`,
        })
      } else {
        res.json({ success: false, errors: errors.errors })
      }
    } catch (error) {
      console.error(error)
      res.json({ message: `Oops, Sum Ting Wong` })
    }
  }
)

export default router
