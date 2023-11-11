const socket = io()
const addStudentForm = document.getElementById('addStudentForm')
const card_uid = document.getElementById('card_uid')
const student_id = document.getElementById('student_id')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const middleName = document.getElementById('middleName')
const course = document.getElementById('course')
const year = document.getElementById('year')
const section = document.getElementById('section')
const avatar = document.getElementById('avatar')

const addStudentModal = document.getElementById('addStudentModal')
const btnShowStudentModal = document.getElementById('btnShowStudentModal')

const _ports = document.getElementById('ports')
const _baudRates = document.getElementById('baudRates')
const _btnConnect = document.getElementById('btnConnect')

const canvas = document.getElementById('confetti')
const studentsTable = document.getElementById('student-list')
const courseFilter = document.getElementById('filter-course')
const yearFilter = document.getElementById('filter-year')
const sectionFilter = document.getElementById('filter-section')
const inputSearch = document.getElementById('inputSearch')
const selectSort = document.getElementById('selectSort')
const selectOrder = document.getElementById('selectOrder')
const resetFilter = document.getElementById('btnResetFilter')

const baudRates = [9600, 115200]
let isModalVisible = false

const jsConfetti = new JSConfetti({ canvas })

const options = {
  valueNames: [
    'id',
    'firstName',
    'middleName',
    'lastName',
    'course',
    'year',
    'section',
    'time_in',
  ],
}

const studentList = new List('student-list', options)

btnShowStudentModal.disabled = true

if (studentsTable.rows.length > 0) {
  studentsTable.rows[1].style.display = 'none'
}

const addToList = (data) => {
  data.forEach((student) => {
    //console.log(student)
    const inList = studentList.get('id', student.id).length > 0
    if (student.attendances.length > 0 && !inList) {
      studentList.add({
        id: student.id,
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        course: student.course,
        year: student.year,
        section: student.section,
        time_in: dayjs(student.attendances[0].createdAt).format('hh:mm:ss a MMM-DD-YY'),
      })
    }
  })
}

// const filterList = () => {
//   console.log('filtering')
//   const selectedCourse = courseFilter.value
//   const selectedYear = yearFilter.value
//   const selectedSection = sectionFilter.value
//   //   console.log(selectedCourse)
//   //   console.log(selectedYear)
//   //   console.log(selectedSection)

//   studentList.filter((item) => {
//     let values = item.values()
//     console.log(item.values().course === selectedCourse)
//     console.log(item.values().year)
//     console.log(item.values().section)
//     return (
//       (selectedCourse === 'all' || item.values().course == selectedCourse) &&
//       (selectedYear === 'all' ||
//         item.values().year == parseInt(selectedYear)) &&
//       (selectedSection === 'all' ||
//         item.values().section == parseInt(selectedYear))
//     )
//   })
// }

const filterList = () => {
  const selectedCourse = courseFilter.value
  const selectedYear = yearFilter.value
  const selectedSection = sectionFilter.value
  let courseF = false
  let yearF = false
  let sectionF = false
  studentList.filter((item) => {
    if (selectedCourse == 'all') {
      courseF = true
    } else {
      courseF = item.values().course == selectedCourse
    }

    if (selectedYear == 'all') {
      yearF = true
    } else {
      yearF = item.values().year == selectedYear
    }

    if (selectedSection == 'all') {
      sectionF = true
    } else {
      sectionF = item.values().section == selectedSection
    }

    return courseF && yearF && sectionF
  })
  //studentList.update()
}

const sortList = (sort, order) => {
  studentList.sort(sort, { order: order })
}

//testing
// const testFilter = () => {
//   let selectedSection = sectionFilter.value
//   console.log(selectedSection)
//   studentList.filter((item) => {
//     console.log(item.values().section === parseInt(selectedSection))
//     return item.values().section === parseInt(selectedSection)
//   })
// }

// const testBtn = document.getElementById('testBtn')
// testBtn.addEventListener('click', testFilter)

const addStudent = async (formData) => {
  try {
    const response = await axios.post('/', formData)
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const htmlErrors = (errors) => {
  let html = '<ul class="list-unstyled text-danger">'

  errors.forEach((error) => (html += `<li class="mb-3">${error.msg}</li>`))
  html += '</ul>'
  return html
}

const htmlProfile = (student, path) => {
  let html = `
    <canvas class="position-absolute w-100 h-100" id="confetti"></canvas>
    <div>
    <img src="${path}" class="img-thumbnail rounded-circle" style="width:250px; height:250px" alt="${student.id}">
    <h3>${student.id}</h3>
    <h3>${student.firstName} ${student.lastName}</h3>
    </div>`
  return html
}

baudRates.forEach((rate) => {
  const option = document.createElement('option')
  option.value = rate
  option.text = rate
  _baudRates.appendChild(option)
})

socket.on('port:available', (ports) => {
  if (ports.length === 0) {
    const option = document.createElement('option')
    option.text = 'No available ports'
    _ports.appendChild(option)
    _btnConnect.disabled = true
  } else {
    ports.forEach((port) => {
      const option = document.createElement('option')
      option.value = port.path
      option.text = port.path
      _ports.appendChild(option)
    })
    _btnConnect.disabled = false
  }
})

socket.on('port:connected', (port) => {
  _btnConnect.disabled = true
  btnShowStudentModal.disabled = false
  Swal.fire({
    icon: 'success',
    title: 'Connected',
    text: `Connected at ${port.path}`,
  })
})

socket.on('port:data', (data) => {
  console.log(data)
  if (data && isModalVisible) {
    const tag = data.trim()
    card_uid.value = tag
  }
  //   if (tag === '91395726' && !isModalVisible) {
  //     Swal.fire({
  //       title: 'Attendance Added.',
  //       text: tag,
  //       width: 600,
  //       padding: '3em',
  //       color: '#716add',
  //       background: '#fff url(/img/trees.png)',
  //       backdrop: `
  //           rgba(0,0,123,0.4)
  //           url("/img/nyan-cat.gif")
  //           left top
  //           no-repeat
  //         `,
  //     })
  //   }
})

socket.on('port:denied', (port) => {
  _btnConnect.disabled = true
  Swal.fire({
    icon: 'error',
    title: 'Failed',
    text: `${port.path} is already in use.`,
  })
})

socket.on('port:disconnect', (port) => {
  _btnConnect.disabled = false
  Swal.fire({
    icon: 'info',
    text: `${port.path} disconnected.`,
  })
})

socket.on('student:data', (data) => {
  console.log(data)
  if (data && !isModalVisible) {
    if (data.avatar && data.id === 1913912) {
      console.log('This noda 🤘')

      const path = '/' + data.avatar.path.replace(/\\/g, '/')
      jsConfetti.addConfetti({
        emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
        emojiSize: 30,
        confettiNumber: 100,
      })
      Swal.fire({
        title: 'Attendance added',
        html: htmlProfile(data, path),
        color: '#716add',
        background: '#fff url(/img/trees.png)',
        backdrop: `
                rgba(0,0,123,0.4)
                url("/img/nyan-cat.gif")
                left top
                no-repeat
              `,
      })
    } else if (data.avatar) {
      console.log('not noda')
      const path = '/' + data.avatar.path.replace(/\\/g, '/')
      Swal.fire({
        html: htmlProfile(data, path),
      })
    } else {
      console.log('no avatar')
      const path = '/img/profile.png'
      Swal.fire({
        html: htmlProfile(data, path),
      })
    }
  }
})

socket.on('student:list', (data) => {
  console.log(data)
  addToList(data)
  filterList()
})

addStudentForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  //if (addStudentForm.checkValidity()) {
  const formData = new FormData()
  formData.append('student_id', student_id.value)
  formData.append('firstName', firstName.value)
  formData.append('lastName', lastName.value)
  formData.append('middleName', middleName.value)
  formData.append('course', course.value)
  formData.append('year', year.value)
  formData.append('section', section.value)
  formData.append('card_uid', card_uid.value)
  formData.append('avatar', avatar.files[0])
  Swal.fire({
    text: 'Adding student in progress...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
  try {
    const response = await addStudent(formData)
    Swal.close() // Close the loading notification
    addStudentForm.reset()
    //console.log(response.data)
    const { success } = response.data
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Complete',
        text: response.data.message,
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        html: htmlErrors(response.data.errors),
      })
    }
  } catch (error) {
    console.log(error)
  }
  //}
})

_btnConnect.addEventListener('click', () => {
  const port = _ports.value
  const baudRate = _baudRates.value
  socket.emit('port:connect', { path: port, baudRate: baudRate })
})

addStudentModal.addEventListener('shown.bs.modal', (event) => {
  console.log('Modal Shown')
  isModalVisible = true
})

addStudentModal.addEventListener('hidden.bs.modal', (event) => {
  console.log('Modal Hidden')
  isModalVisible = false
  addStudentForm.reset()
  card_uid.value = ''
})

courseFilter.addEventListener('change', filterList)
yearFilter.addEventListener('change', filterList)
sectionFilter.addEventListener('change', filterList)
inputSearch.addEventListener('input', () => {
  console.log('searching')
  studentList.search(inputSearch.value)
})
selectSort.addEventListener('change', () => {
  if (selectSort.value !== 'none' && selectOrder.value !== 'none') {
    console.log('sorting')
    sortList(selectSort.value, selectOrder.value)
  }
})
selectOrder.addEventListener('change', () => {
  if (selectSort.value !== 'none' && selectOrder.value !== 'none') {
    console.log('sorting')
    sortList(selectSort.value, selectOrder.value)
  }
})
resetFilter.addEventListener('click', () => {
  console.log('filter cleared')
  studentList.filter()
  courseFilter.value = 'all'
  yearFilter.value = 'all'
  sectionFilter.value = 'all'
})
