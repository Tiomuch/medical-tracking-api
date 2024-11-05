import mongoose, { Document, Schema } from 'mongoose'

interface Experience {
  institution: string
  position: string
  startDate: Date
  endDate?: Date // Optional, in case the doctor is currently working there
}

interface Certificate {
  title: string
  issuedBy: string
  issueDate: Date
  fileUrl: string // URL of the certificate file
}

interface Doctor extends Document {
  firstName: string
  lastName: string
  middleName?: string
  specialty: string
  experience: Experience[]
  certificates: Certificate[]
}

const ExperienceSchema = new Schema<Experience>({
  institution: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date }
})

const CertificateSchema = new Schema<Certificate>({
  title: { type: String, required: true },
  issuedBy: { type: String, required: true },
  issueDate: { type: Date, required: true },
  fileUrl: { type: String, required: true }
})

const DoctorSchema = new Schema<Doctor>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  specialty: { type: String, required: true },
  experience: { type: [ExperienceSchema], required: true },
  certificates: { type: [CertificateSchema], required: true }
})

export default mongoose.model<Doctor>('Doctor', DoctorSchema)
