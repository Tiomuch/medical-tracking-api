import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authMiddleware = (req: any) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch {
    throw new Error('Invalid token')
  }
}
