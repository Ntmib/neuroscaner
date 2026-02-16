import { useState } from 'react'
import { questions } from '../data/questions'
import '../styles/quiz.css'

export default function QuizPage({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [animating, setAnimating] = useState(false)

  const handleSelect = (option) => {
    if (animating) return

    const newAnswers = [...answers]
    newAnswers[currentIndex] = option
    setAnswers(newAnswers)
    setAnimating(true)

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        onComplete(newAnswers)
      }
      setAnimating(false)
    }, 350)
  }

  const handleBack = () => {
    if (currentIndex > 0 && !animating) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const progress = ((currentIndex + 1) / questions.length) * 100
  const question = questions[currentIndex]

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="quiz-progress-info">
          {currentIndex > 0 && (
            <button className="quiz-back" onClick={handleBack}>
              ← Назад
            </button>
          )}
          <span className="quiz-step">{currentIndex + 1} из {questions.length}</span>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={`quiz-question ${animating ? 'quiz-question-exit' : 'fade-in'}`} key={currentIndex}>
        <h2 className="quiz-title">{question.question}</h2>

        <div className="quiz-options">
          {question.options.map((option, i) => {
            const isSelected = answers[currentIndex]?.profession === option.profession
            return (
              <button
                key={i}
                className={`quiz-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <span className="quiz-option-letter">{'ABCD'[i]}</span>
                <span className="quiz-option-text">{option.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
