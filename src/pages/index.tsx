import React, { useContext } from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"
import SEO from "../components/seo"

const allBookmarksQuery = gql`
  {
    allBookmarks {
      id
      title
      description
      link
    }
  }
`

const IndexPage = () => {
  const { loading, data, error } = useQuery(allBookmarksQuery)

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <ul>
        {data.allBookmarks.map(bookmark => (
          <li key={bookmark.id}>
            <h4>{bookmark.title}</h4>
            <p>{bookmark.description}</p>
            <a href={bookmark.link} target="_blank">
              open
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
export default IndexPage
