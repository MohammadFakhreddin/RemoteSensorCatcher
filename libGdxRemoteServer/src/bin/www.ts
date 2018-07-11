#!/usr/bin/env node

import Cluster from 'cluster'
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
  // tslint:disable-next-line:no-unused-expression
  new ChatServer(Number(port))
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
