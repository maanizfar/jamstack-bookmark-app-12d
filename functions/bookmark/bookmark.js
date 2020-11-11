require("dotenv").config()
const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb")

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET_KEY,
})

const typeDefs = gql`
  type Query {
    allBookmarks: [Bookmark!]
  }

  type Mutation {
    addBookmark(title: String!, description: String!, link: String!): Bookmark
  }

  type Bookmark {
    id: ID!
    title: String!
    description: String!
    link: String!
  }
`

const resolvers = {
  Query: {
    allBookmarks: async () => {
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("all_bookmarks"))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log("allBookmarks result: ", result.data)
        return result.data.map(d => ({
          id: d.ref.id,
          title: d.data.title,
          description: d.data.description,
          link: d.data.link,
        }))
      } catch (error) {
        console.log("allBookmarks error: ", error)
      }
    },
  },
  Mutation: {
    addBookmark: async (_, { title, description, link }) => {
      try {
        const result = await client.query(
          q.Create(q.Collection("bookmarks"), {
            data: {
              title,
              description,
              link,
            },
          })
        )
        console.log("addBookmark result: ", result.ref.data)
        return result.ref.data
      } catch (error) {
        console.log("addBookmark error: ", error)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
})

const handler = server.createHandler()

module.exports = { handler }
