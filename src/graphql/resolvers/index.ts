import bcrypt from 'bcryptjs'
import User from '../../models/User'
import VerificationCode from '../../models/VerificationCode'
import { sendVerificationCode } from '../../utils/emailService'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from '../../utils/tokenService'

export const resolvers = {
  Mutation: {
    sendCode: async (_: unknown, { email }: { email: string }) => {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      await VerificationCode.findOneAndDelete({ email })
      await new VerificationCode({ email, code }).save()
      await sendVerificationCode(email, code)
      return 'Verification code sent to your email'
    },

    verifyCodeAndRegister: async (
      _: unknown,
      {
        email,
        code,
        password
      }: { email: string; code: string; password: string }
    ) => {
      const verificationRecord = await VerificationCode.findOne({ email, code })
      if (!verificationRecord) throw new Error('Invalid or expired code')

      const existingUser = await User.findOne({ email })
      if (existingUser) throw new Error('User already exists')

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = new User({ email, password: hashedPassword })
      await user.save()
      await VerificationCode.findOneAndDelete({ email })

      const accessToken = generateAccessToken(user.id)
      const refreshToken = generateRefreshToken(user.id)
      return { ...user.toObject(), accessToken, refreshToken }
    },

    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email })
      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new Error('Invalid email or password')

      const accessToken = generateAccessToken(user.id)
      const refreshToken = generateRefreshToken(user.id)
      return { ...user.toObject(), accessToken, refreshToken }
    },

    refreshToken: async (_: unknown, { token }: { token: string }) => {
      try {
        const payload = verifyToken(token, process.env.JWT_REFRESH_SECRET!)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const newAccessToken = generateAccessToken(payload.userId)
        return newAccessToken
      } catch {
        throw new Error('Invalid refresh token')
      }
    },

    changePassword: async (
      _: unknown,
      {
        email,
        currentPassword,
        newPassword
      }: { email: string; currentPassword: string; newPassword: string }
    ) => {
      const user = await User.findOne({ email })
      if (!user || !(await bcrypt.compare(currentPassword, user.password)))
        throw new Error('Current password is incorrect')

      user.password = await bcrypt.hash(newPassword, 10)
      await user.save()
      return 'Password updated successfully'
    },

    changeEmail: async (
      _: unknown,
      {
        currentEmail,
        newEmail,
        code
      }: { currentEmail: string; newEmail: string; code: string }
    ) => {
      const verificationRecord = await VerificationCode.findOne({
        email: newEmail,
        code
      })
      if (!verificationRecord) throw new Error('Invalid or expired code')

      const user = await User.findOne({ email: currentEmail })
      if (!user) throw new Error('User not found')

      user.email = newEmail
      await user.save()
      await VerificationCode.findOneAndDelete({ email: newEmail })

      return 'Email updated successfully'
    }
  }
}