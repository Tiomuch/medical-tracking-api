import mongoose, { Document, Schema } from 'mongoose'

interface User extends Document {
  email: string
  password: string
  role?: 'User' | 'Doctor'
  firstName?: string
  lastName?: string
  middleName?: string
  bloodGroup?: string
  birthDate?: Date
  phone?: string
  gender?: string
  allergies?: string[]
  operations?: Array<{
    date: Date
    description: string
    photos?: string[]
  }>
  medicalCategories?: {
    category: string
    diagnoses: string[]
    visits: Array<{
      date: Date
      diagnosis?: string
      description: string
      files?: string[]
    }>
  }[]
}

const UserSchema = new Schema({
  email: String,
  password: String,
  role: { type: String, required: false, enum: ['User', 'Doctor'] },
  firstName: String,
  lastName: String,
  middleName: String,
  bloodGroup: String,
  birthDate: Date,
  phone: String,
  gender: String,
  allergies: [String],
  operations: [
    {
      date: Date,
      description: String,
      photos: [String]
    }
  ],
  medicalCategories: [
    {
      category: String,
      diagnoses: [String],
      visits: [
        {
          date: Date,
          diagnosis: String,
          description: String,
          files: [String]
        }
      ]
    }
  ]
})

export default mongoose.model<User>('User', UserSchema)
