import { listSerialPorts ,createSerialPort,createReadlineParser} from "./port.js"
import rawlist from "@inquirer/rawlist";
import select from "@inquirer/select";
import figlet from 'figlet'
import gradient from 'gradient-string'


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
}
welcome()
const serialPorts = await listSerialPorts()
const choices = serialPorts.map(port => {
    return {
        name: port.path,
        value: port.path
    }
})

const answer = await select({
    message: 'Select serial port',
    choices: choices
})
console.log(answer);
// const serialPort = createSerialPort({
//     path: port.path,
//     baudRate: 9600,
// })
// const parser = serialPort.pipe(createReadlineParser({ delimiter: '\n' }))

// serialPort.on('open', () => {
// })
