#!/usr/bin/env node

import Cluster from 'cluster'
import * as Http from 'http'
import {App} from './../App'
import {EnvironmentVariables} from './../Config'
import {Logger} from './../utils/Logger'
import {ChatServer} from './../web_sockets/WebSocket'

const setEnv =  (env) => {
  switch (env) {
    case 'dev':
      EnvironmentVariables.isDev = true
      EnvironmentVariables.isTest = false
      break
    case 'prod':
      EnvironmentVariables.isDev = false
      EnvironmentVariables.isTest = false
      break
    case 'test':
      EnvironmentVariables.isDev = true
      EnvironmentVariables.isTest = true
      break
  }
}

setEnv(process.argv[2] || 'dev')

if (Cluster.isWorker) {
  const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        Logger.error(bind + ' requires elevated privileges')
        process.exit(1)
      case 'EADDRINUSE':
        Logger.error(bind + ' is already in use')
        process.exit(1)
      default:
        throw error
    }
  }
  const onListening = () => {
    const addr = server.address()
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    Logger.log('Server is listening to ' + bind)
  }
  /**
   * Normalize a port into a number, string, or false.
   */
  const normalizePort = (value: string) => {
    const localPort = parseInt(value, 10)
    if (isNaN(localPort)) {
      // named pipe
      return value
    }
    if (localPort >= 0) {
      // localPort number
      return localPort
    }
    return false
  }
  const port = normalizePort(process.env.PORT || EnvironmentVariables.port)
  App.set('port', port)
  const server = Http.createServer(App)
  server.listen(Number(port), '0.0.0.0', null, null)
  server.on('error', onError)
  server.on('listening', onListening)
  // tslint:disable-next-line:no-unused-expression
  new ChatServer(server)
  Logger.log(__filename, 'Server is running on ' + port)
} else {
  Cluster.fork()
  Cluster.on('online', (worker) => {
    Logger.log('Worker ' + worker.process.pid + ' is online', __filename)
  })
  Cluster.on('exit', (worker) => {
    Logger.log('Worker ' + worker.process.pid + ' has stopped working', __filename)
    if (!EnvironmentVariables.isDev) {
      Cluster.fork()
    }
  })
}

process.on('uncaughtException', (exception) => {
  if (EnvironmentVariables.isDev) {
    throw exception
  } else {
    const contents = Date.now().toString() + '\n' + exception.stack.toString()
    Logger.error(contents, __filename)
  }
})
