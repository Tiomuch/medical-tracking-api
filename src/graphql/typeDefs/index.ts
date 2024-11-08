import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Operation {
    date: String
    description: String
    photos: [String]
  }

  type Visit {
    date: String
    diagnosis: String
    description: String
    files: [String]
  }

  type MedicalCategory {
    category: String
    diagnoses: [String]
    visits: [Visit]
  }

  type Experience {
    description: String
    startDate: String
    endDate: String
  }

  input UpdateUserInput {
    role: String
    firstName: String
    lastName: String
    middleName: String
    bloodGroup: String
    birthDate: String
    phone: String
    gender: String
    allergies: [String]
    operations: [OperationInput]
    medicalCategories: [MedicalCategoryInput]
    certificates: [String]
    experience: [ExperienceInput]
    position: String
  }

  input OperationInput {
    date: String
    description: String
    photos: [String]
  }

  input VisitInput {
    date: String
    diagnosis: String
    description: String
    files: [String]
  }

  input MedicalCategoryInput {
    category: String
    diagnoses: [String]
    visits: [VisitInput]
  }

  input ExperienceInput {
    description: String
    startDate: String
    endDate: String
  }

  type User {
    _id: ID!
    email: String!
    password: String!
    role: String
    firstName: String
    lastName: String
    middleName: String
    bloodGroup: String
    birthDate: String
    phone: String
    gender: String
    allergies: [String]
    operations: [Operation]
    medicalCategories: [MedicalCategory]
    certificates: [String]
    experience: [Experience]
    position: String
    accessToken: String
    refreshToken: String
    sharedWith: [String]
  }

  type Mutation {
    sendCode(email: String!): String
    verifyCodeAndRegister(
      email: String!
      code: String!
      password: String!
    ): User
    login(email: String!, password: String!): User
    refreshToken(token: String!): String
    changePassword(
      email: String!
      currentPassword: String!
      newPassword: String!
    ): String
    changeEmail(currentEmail: String!, newEmail: String!, code: String!): String
    updateUser(_id: ID!, input: UpdateUserInput!): User
    shareCard(patientId: ID!, doctorId: ID!): String
  }

  type Query {
    getUser(_id: ID!): User
    getUsers(
      role: String
      position: String
      search: String
      page: Int
      limit: Int
    ): [User]
    getSharedCards(doctorId: ID!, search: String, page: Int, limit: Int): [User]
  }
`
