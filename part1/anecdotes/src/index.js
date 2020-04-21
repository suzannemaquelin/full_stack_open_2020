import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(props.anecdotes.length).fill(0))
  const [mostVotes, setMostVotes] = useState(0)

  const nextAnecdote = () => {
    const size = props.anecdotes.length
    const next = Math.floor(Math.random()*size)
    setSelected(next)
  }

  const updateVote = () => {
    const copy = [...points]
    copy[selected] += 1
    if (copy[selected] > copy[mostVotes]) {
      setMostVotes(selected)
    }
    console.log(mostVotes)
    setPoints(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}<br></br>
      has {points[selected]} votes<br></br>
      <button onClick={updateVote}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {props.anecdotes[mostVotes]}<br></br> has {points[mostVotes]} votes
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)