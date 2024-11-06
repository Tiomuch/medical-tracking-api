import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import VerificationCode from '../models/VerificationCode'
import { sendVerificationCode } from '../utils/emailService'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from '../utils/tokenService'

// Генерація та відправка коду підтвердження
export const sendCode = async (req: Request, res: Response) => {
  try {
    // Перевірка на наявність email в запиті
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    console.log('email', email)
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Видалення попереднього коду
    await VerificationCode.findOneAndDelete({ email })
    await new VerificationCode({ email, code }).save()

    // Відправка коду на email
    await sendVerificationCode(email, code)

    res.status(200).json({ message: 'Verification code sent to your email' })
  } catch (error) {
    console.error('Error in sendCode:', error)
    res.status(500).json({ message: 'Failed to send verification code' })
  }
}

// Перевірка коду та створення користувача
export const verifyCodeAndRegister = async (req: Request, res: Response) => {
  try {
    // Перевірка на наявність усіх необхідних полів
    const { email, code, password } = req.body
    if (!email || !code || !password) {
      return res
        .status(400)
        .json({ message: 'Email, code, and password are required' })
    }

    // Перевірка на наявність користувача в БД
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Перевірка коду
    const verificationRecord = await VerificationCode.findOne({ email, code })
    if (!verificationRecord) {
      return res.status(400).json({ message: 'Invalid or expired code' })
    }

    // Хешування паролю
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashedPassword })
    await user.save()

    // Видалення коду після використання
    await VerificationCode.findOneAndDelete({ email })

    // Генерація токенів
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.status(201).json({ accessToken, refreshToken })
  } catch (error) {
    console.error('Error in verifyCodeAndRegister:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
}

// Логін користувача
export const login = async (req: Request, res: Response) => {
  try {
    // Перевірка на наявність усіх полів
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Генерація токенів
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.status(200).json({ accessToken, refreshToken })
  } catch (error) {
    console.error('Error in login:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

// Оновлення access-токена за допомогою refresh-токена
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' })
    }

    const payload = verifyToken(token, process.env.JWT_REFRESH_SECRET!)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const newAccessToken = generateAccessToken(payload?.userId)

    res.status(200).json({ accessToken: newAccessToken })
  } catch (error) {
    console.error('Error in refreshToken:', error)
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}
