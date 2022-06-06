import React from 'react'
import './App.css'
import QuestionCart from './components/QuestionCard'
import { Difficulty, QuestionState } from './API'
import { fetchQuizQuestions } from './API'
import { GlobalStyle, Wrapper } from './App.styles'

const TOTAL_QUESTION = 10

export type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}
const App = () => {
  const [loading, setLoading] = React.useState(false)
  const [questions, setQuestions] = React.useState<QuestionState[]>([])
  const [number, setNumber] = React.useState(0)
  const [userAnswers, setuserAnswers] = React.useState<AnswerObject[]>([])
  const [score, setScore] = React.useState(0)
  const [gameOver, setGameOver] = React.useState(true)
  const startTrivia = async () => {
    setLoading(true)
    setGameOver(false)
    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY,
    )
    setQuestions(newQuestion)
    setScore(0)
    setuserAnswers([])
    setNumber(0)
    setLoading(false)
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value
      const correct = questions[number].correct_answer === answer
      if (correct) setScore((prev) => prev + 1)
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      setuserAnswers((prev) => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTION ? (
          <button onClick={startTrivia} className="start">
            start
          </button>
        ) : null}
        {!gameOver ? <p className="score">Score: {score} </p> : null}
        {loading ? <p>Loading Question...</p> : null}
        {!loading && !gameOver && (
          <QuestionCart
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTION}
            question={questions[number].question}
            answers={questions[number].answer}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        <hr />
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      </Wrapper>
    </>
  )
}

export default App
