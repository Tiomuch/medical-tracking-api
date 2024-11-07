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
    accessToken: String
    refreshToken: String
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
  }
`
