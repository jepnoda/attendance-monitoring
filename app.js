import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
//import { AsyncParser } from 'json2csv'
import { format } from 'date-fns'

import index from './routes/index.js'
import {
  listSerialPorts,
  createSerialPort,
  createReadlineParser,
} from './port.js'

import {
  findStudentByTag,
  createAttendance,
  findCourseYearSection,
  findByCourseYearSection,
  listAllStudent,
} from './controllers/student.js'
import { deleteIfExists } from './helpers/file.js'
import { createWriteStream } from 'fs'
import { stringify } from 'csv-stringify'
import figlet from 'figlet'
import gradient from 'gradient-string'

const port = 3000
const app = express()
const server = http.createServer(app)
const io = new Server(server)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let serialPort = null
let parser = null
let connectedClient = null

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views/'))

app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, '..', '/uploads')))
app.use('/', index)

const welcome = () => {
  console.log(
    gradient.atlas(
      figlet.textSync('ATTENDANCE MONITORING', {
        font: 'ANSI Regular',
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 100,
      })
    )
  )

  console.log(
    gradient.cristal(
      `Author: Jeperson Noda\nGithub: https://github.com/youdonut
      `
    )
  )

  //(await chalkAnimation).rainbow('Hello World');
}
welcome()

const listStudent = async (io) => {
  try {
    const studentList = await listAllStudent()
    io.emit('student:list', studentList)
  } catch (error) {
    console.log(error)
  }
}

/**
 * TODO:
 * CONSISTENT ERROR HANDLING
 * CLEAN CALLBACKS
 * PROMISIFY
 *
 */
io.on('connection', async (socket) => {
  console.log('Connection with client established.')
  listStudent(io)

  try {
    const ports = await listSerialPorts()
    io.emit('port:available', ports)
  } catch (error) {
    console.error('Error listing serial ports: ', error)
    io.emit('port:available', [])
  }

  socket.on('port:connect', async (port) => {
    if (connectedClient === null) {
      //Creates and Open Serial Port
      serialPort = createSerialPort({
        path: port.path,
        baudRate: parseInt(port.baudRate, 10),
      })
      parser = serialPort.pipe(createReadlineParser({ delimiter: '\n' }))

      //When the port is open (Automatically Emitted), the open event is emitted.
      serialPort.on('open', () => {
        socket.emit('port:connected', port)
      })

      parser.on('data', async (data) => {
        socket.emit('port:data', data)
        if (data) {
          try {
            //Creating Attendance
            const students = await findStudentByTag(data.toString().trim())
            //console.log(students[0].dataValues)
            if (students.length > 0) {
              const student = students[0]
              const attendance = await createAttendance(true)
              await student.addAttendance(attendance)
              console.log('Attendance added: ', student.dataValues.id)
              socket.emit('student:data', student)
            } else {
              console.log('No student found for the given tag')
            }

            //Exporting File
            const groupedStudents = await findCourseYearSection()
            if (groupedStudents.length > 0) {
              groupedStudents.forEach(async (data) => {
                const { course, year, section } = data.dataValues
                const date = format(new Date(), 'yy-MM-dd')
                const fileName = `${date}_${course}_${year}_${section}.csv`
                deleteIfExists(fileName)

                const group = await findByCourseYearSection({
                  course,
                  year,
                  section,
                })
                if (group.length > 0) {
                  const studentStatus = group.map((data) => {
                    const {
                      id,
                      firstName,
                      middleName,
                      lastName,
                      course,
                      year,
                      section,
                      attendances,
                    } = data.dataValues
                    let timeIn
                    if (attendances?.length > 0) {
                      const { createdAt } = attendances[0].dataValues
                      if (createdAt) {
                        timeIn = format(createdAt, 'yyyy-MM-dd HH:mm:ss')
                      } else {
                        timeIn = 'None'
                      }
                    } else {
                      timeIn = 'None'
                    }
                    let status = timeIn !== 'None' ? 'Present' : 'Absent'
                    return [
                      id,
                      firstName,
                      middleName,
                      lastName,
                      course,
                      year,
                      section,
                      status,
                      timeIn,
                    ]
                  })

                  const columns = [
                    'id',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'course',
                    'year',
                    'section',
                    'status',
                    'time_in',
                  ]
                  const writableStream = createWriteStream(fileName)
                  const stringifier = stringify({
                    header: true,
                    columns: columns,
                  })

                  studentStatus.forEach((data) => {
                    stringifier.write(data)
                  })

                  stringifier.pipe(writableStream)
                  console.log('Finished writing data.')
                  stringifier.on('error', (err) => {
                    console.error(err)
                  })
                  writableStream.on('error', (err) => {
                    console.error(err)
                  })
                  stringifier.end()
                }
              })
            }
            listStudent(io).then(() => console.log('listStudent'))
          } catch (error) {
            console.error(error)
          }
        }
      })

      serialPort.on('close', (err) => {
        socket.emit('port:disconnect', port)
      })

      //When an error occurs, an error event is emitted.
      serialPort.on('error', (err) => {
        if (!err) {
          serialPort.close((err) => {
            if (!err) serialPort = null
          })
        }
      })
      connectedClient = socket
    } else {
      socket.emit('port:denied', port)
    }
  })

  socket.on('disconnect', async () => {
    if (connectedClient === socket) {
      connectedClient = null
      //console.log('Client disconnected.')
      if (serialPort) {
        serialPort.close((err) => {
          if (!err) {
            serialPort = null
            console.log('Serial port closed.')
          }
        })
      }
    }
  })
})
app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>')
})

server.listen(port, () => {
  console.log(
    `${gradient.cristal('Server listening on :')} ${gradient.instagram(
      'http://localhost:3000'
    )}`
  )
})
