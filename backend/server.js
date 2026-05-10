import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import studentRoutes from './routes/studentRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import schoolRoutes from './routes/schoolRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import sequelize from './DB/Db.js'
import initModels from './models/init.model.js'



dotenv.config()

const app = express()
app.use(express.json())


app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}))



const port = process.env.PORT || 3000



initModels(sequelize);

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
        return sequelize.sync({ force: false });
    })
    .then(() => {
        console.log("Database & tables synced successfully!");
    })
    .catch((err) => {
        console.error("Unable to connect to the database or sync tables:", err);
    });



// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the School Management API')
})

// Routes
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/schools', schoolRoutes)
app.use('/api/subjects', subjectRoutes)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal server error', error: err.message })
})

app.listen(port, () => {
    console.log(`School Management API listening on port ${port}`)
})