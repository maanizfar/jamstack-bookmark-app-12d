import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"
import SEO from "../components/seo"

interface Bookmark {
  id: number
  title: string
  description: string
  link: string
}

interface Bookmarks {
  allBookmarks: Bookmark[]
}

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

const addBookmarkMutation = gql`
  mutation addBookmark($title: String!, $description: String!, $link: String!) {
    addBookmark(title: $title, description: $description, link: $link) {
      id
    }
  }
`

const IndexPage = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")

  const { loading, data, error } = useQuery<Bookmarks>(allBookmarksQuery)
  const [addBookmark] = useMutation(addBookmarkMutation)

  const onSubmitForm = () => {
    addBookmark({
      variables: {
        title,
        description,
        link,
      },
      refetchQueries: [{ query: allBookmarksQuery }],
    }).then(() => {
      setTitle("")
      setDescription("")
      setLink("")
    })
  }

  if (loading) return <p>Loading...</p>

  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <SEO title="Home" />
      <h1>Hi people</h1>

      <form
        onSubmit={e => {
          e.preventDefault()
          onSubmitForm()
        }}
      >
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <label>Description</label>
        <input
          type="text"
          name="desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <label>Link</label>
        <input
          type="text"
          name="link"
          value={link}
          onChange={e => setLink(e.target.value)}
          required
        />
        <input type="submit" value="Add" />
      </form>

      <ul>
        {data?.allBookmarks.map(bookmark => (
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
