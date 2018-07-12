import BodyParser from 'body-parser'
import CookieParser from 'cookie-parser'
import Express from 'express'
import Morgan from 'morgan'
import path from 'path'
import IndexRoute from './routes/Index'

const app = Express()
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
app.use(Morgan('dev'))
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
app.use(Morgan('dev'))
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.text({ type: 'application/json' }))
app.use(BodyParser.urlencoded({ limit: '500mb', extended: true }))
app.use(BodyParser.json({ limit: '500mb'}))
app.use(CookieParser())
app.use(Express.static(path.join(__dirname, 'public')))
app.use('/', IndexRoute)

export const App = app
