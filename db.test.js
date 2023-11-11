import {
  createStudent,
  createTag,
  findCourseYearSection,
  findByCourseYearSection,
} from './controllers/student.js'

// const studentMockData = {
//   id: 1913912,
//   firstName: 'John',
//   lastName: 'Doe',
//   middleName: 'Trump',
//   course: 'BSIT',
//   year: 4,
//   section: 2,
// }

// const tagMockData = 'tag_sample_data'

// const student = await createStudent(studentMockData)
// console.log('student created')
// const tag = await createTag(tagMockData)
// console.log('tag created')
// await student.setTag(tag)
// console.log('tag associated')

const result = await findCourseYearSection()

result.forEach(async (d) => {
  const { course, year, section } = d.dataValues
  const students = await findByCourseYearSection({
    course,
    year,
    section,
  })
  students.forEach((d) => {
    console.log(d.dataValues)
  })
})
