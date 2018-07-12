import Os from 'os'
import Path from 'path'

export const EnvironmentVariables  = {
  port:  '8082',
  isDev:  true,
  isTest:  false,
  logFolder: Path.join(__dirname, '../log'),
  exceptionAddress: Path.join(__dirname, '../log/exceptions.log'),
  logAddress: Path.join(__dirname, '../log/logs.log'),
  isWindows: /^win/.test(Os.platform())
}

export const NetworkVariables = {
  timeout: 1000
}
