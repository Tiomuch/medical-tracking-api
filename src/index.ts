import express from 'express'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'

dotenv.config()

const app = express()

connectDB()

app.use(express.json())

app.use(
  cors({
    origin: '*',
    credentials: true
  })
)

app.use('/auth', authRoutes)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
