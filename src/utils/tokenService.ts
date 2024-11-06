import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15m' })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d'
  })
}

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret)
}
