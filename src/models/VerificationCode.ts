import mongoose, { Document, Schema } from 'mongoose'

interface IVerificationCode extends Document {
  email: string
  code: string
  createdAt: Date
}

const VerificationCodeSchema = new Schema<IVerificationCode>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Code expires in 5 minutes
})

export default mongoose.model<IVerificationCode>(
  'VerificationCode',
  VerificationCodeSchema
)
