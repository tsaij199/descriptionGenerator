import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function Topic() {
  const { topicName } = useParams()
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await axios.post('/generate-description', { query: topicName })
        setDescription(response.data.response)
      } catch (err) {
        setError('Failed to generate description. Contact developer to fix issue.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDescription()
  }, [topicName])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h2>{topicName}:</h2>
      <p>{description}</p>
      <Link to="/">Back to main page</Link>
    </div>
  )
}

export default Topic