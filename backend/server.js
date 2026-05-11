import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRoutes from './routes/studentRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import schoolRoutes from './routes/schoolRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import authRoutes from './routes/authRoutes.js'
import sequelize from './DB/Db.js'
import initModels from './models/init.model.js'
import { protect } from './middleware/authMiddleware.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const localhostDev = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      if (localhostDev.test(origin)) return callback(null, true)
      if (corsOrigins.length && corsOrigins.includes(origin)) return callback(null, true)
      callback(null, false)
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

const port = process.env.PORT || 3000

initModels(sequelize)

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.')
    return sequelize.sync({ force: false })
  })
  .then(() => {
    console.log('Database & tables synced successfully!')
  })
  .catch((err) => {
    console.error('Unable to connect to the database or sync tables:', err)
  })

app.get('/', (req, res) => res.send('Welcome to the School Management API'))
app.use('/api/auth', authRoutes)

app.use('/api/students', protect, studentRoutes)
app.use('/api/teachers', protect, teacherRoutes)
app.use('/api/schools',  protect, schoolRoutes)
app.use('/api/subjects', protect, subjectRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error', error: err.message })
})

app.listen(port, () => {
  console.log(`School Management API listening on port ${port}`)
})