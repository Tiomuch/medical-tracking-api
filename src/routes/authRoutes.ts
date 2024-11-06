/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from 'express'
import {
  sendCode,
  verifyCodeAndRegister,
  login,
  refreshToken
} from '../controllers/authController'

const router = Router()

// @ts-ignore
router.post('/send-code', sendCode)
// @ts-ignore
router.post('/verify-code', verifyCodeAndRegister)
// @ts-ignore
router.post('/login', login)
// @ts-ignore
router.post('/refresh-token', refreshToken)

export default router
