import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs'
import { resolvers } from './graphql/resolvers'
import connectDB from './config/db'
import { authMiddleware } from './auth/authMiddleware'

const app = express()
const PORT = process.env.PORT || 3000

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      try {
        const user = req?.headers?.authorization ? authMiddleware(req) : null
        return { user }
      } catch (error) {
        throw new Error(`${error}`)
      }
    }
  })
  await server.start()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  server.applyMiddleware({ app, path: '/graphql' })

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    )
  })
}

connectDB()
startServer()
