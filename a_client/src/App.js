import './App.css'
import axios from 'axios'
import { useState, useRef } from 'react'
import toPDF from 'react-to-pdf'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Topic from './Topic'


function capitalize(str) {
  str = str.split(' ')
  for (let i=0; i<str.length; i++){
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1) + " "
  }
  return str
}

function App() {

  const [topic1, setTopic1] = useState('')
  const [topic2, setTopic2] = useState('')
  const [topic3, setTopic3] = useState('')
  const [topic4, setTopic4] = useState('')
  const [topic5, setTopic5] = useState('')

  const [query, setQuery] = useState('')
  const [customization, setCustomization] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')

  const [description, setDescription] = useState('')
  const [summary, setSummary] = useState('')

  const [isLoadingDescription, setIsLoadingDescription] = useState(false)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  const [descriptionError, setDescriptionError] = useState('')
  const [summaryError, setSummaryError] = useState('')

  const descriptionRef = useRef()

  const handleDescription = async (e) => 
  {
    e.preventDefault()
    setIsLoadingDescription(true)
    setDescriptionError('')
    setDescription('')
    setSummary('')
    setTopic1('')
    setTopic2('')
    setTopic3('')
    setTopic4('')
    setTopic5('')

    try {
      const response = await axios.post('/generate-description', {query, customization})
      setDescription(response.data.response)
      setCurrentQuery(query)
      const topics = await axios.post('/generate-related-topics', {query})
      setTopic1(topics.data.topic1)
      setTopic2(topics.data.topic2)
      setTopic3(topics.data.topic3)
      setTopic4(topics.data.topic4)
      setTopic5(topics.data.topic5)
    } catch (err) {
      setDescriptionError('Failed to generate description. Contact developer to fix issue.')
      console.error(err)
    } finally {
      setIsLoadingDescription(false)
    }
  }

  const handleSummary = async () => 
  {
    if (!description) {
      setSummaryError('Please successfully generate a description first.')
      return
    }

    setIsLoadingSummary(true)
    setSummaryError('')
    setSummary('')

    try{
      const response = await axios.post('/generate-summary', {description: description})
      setSummary(response.data.response)
    } catch (err) {
      setSummaryError('Failed to generate summary. Contact developer to fix issue.')
      console.error(err)
    } finally {
      setIsLoadingSummary(false)
    }
  }

  return(
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <h1>Description Generator</h1>
              <form onSubmit={handleDescription}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Topic for description"
                  required
                  style={{ width: '120px' }}
                />
                <input
                  type="text"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  placeholder="What customization you want"
                  style={{ width: '175px' }}
                />
                <button type="submit" disabled={isLoadingDescription}>
                  {isLoadingDescription ? 'Generating...' : 'Generate Description'}
                </button>
              </form>
                {descriptionError && <p className="error">{descriptionError}</p>}
                {description && (
                  <div className="description" ref={descriptionRef}>
                    <h2>Generated Description about {capitalize(currentQuery)}:</h2>
                    <p>{description}</p>
                  </div>   
                )}

                {description && (
                  <button onClick={() => toPDF(descriptionRef, {filename: 'generated_description.pdf'})}>
                    Download Description as PDF
                  </button> 
                )}

                {description && (
                  <>
                    <h2>Related Topics</h2>
                    <Link to={`/topic/${encodeURIComponent(topic1)}`}>{topic1}</Link>
                    <br />
                    <Link to={`/topic/${encodeURIComponent(topic2)}`}>{topic2}</Link>
                    <br />
                    <Link to={`/topic/${encodeURIComponent(topic3)}`}>{topic3}</Link>
                    <br />
                    <Link to={`/topic/${encodeURIComponent(topic4)}`}>{topic4}</Link>
                    <br />
                    <Link to={`/topic/${encodeURIComponent(topic5)}`}>{topic5}</Link>
                  </>
                )} 

                <h1>Summary Generator</h1>
                <button onClick={handleSummary} disabled = {isLoadingSummary}>
                  {isLoadingSummary ? 'Generating...' : 'Generate Summary'}
                </button>
                {summaryError && <p className="error">{summaryError}</p>}
                {summary && (
                  <div className="summary">
                    <h2>Generated Summary:</h2>
                    <p>{summary}</p>
                  </div>
                )}
               </>
            } />
          <Route path="/topic/:topicName" element={<Topic />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App