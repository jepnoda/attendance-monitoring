import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

export const listSerialPorts = async () => {
  try {
    const ports = await SerialPort.list()
    return ports
  } catch (error) {
    console.error('Error listing Serial Ports: ', error)
    return []
  }
}

export const createSerialPort = (options) => {
  return new SerialPort(options)
}

export const createReadlineParser = (options) => {
  return new ReadlineParser(options)
}
