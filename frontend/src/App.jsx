import { useState, useEffect } from 'react'
import WelcomePage from './pages/WelcomePage'
import QuizPage from './pages/QuizPage'
import LoadingPage from './pages/LoadingPage'
import ResultPage from './pages/ResultPage'
import { calculateScores } from './utils/scoring'
import { trackStarted, trackCompleted } from './utils/analytics'
import './styles/app.css'

const tg = window.Telegram?.WebApp

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [result, setResult] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()
      tg.setHeaderColor('#0a0a0f')
      tg.setBackgroundColor('#0a0a0f')
      setUser(tg.initDataUnsafe?.user || null)
    }

    const saved = localStorage.getItem('neuroScanResult')
    if (saved) {
      try {
        setResult(JSON.parse(saved))
        setScreen('result')
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const handleStartQuiz = () => {
    trackStarted()
    setScreen('quiz')
  }

  const handleQuizComplete = (answers) => {
    setScreen('loading')
    const scores = calculateScores(answers)

    setTimeout(() => {
      setResult(scores)
      localStorage.setItem('neuroScanResult', JSON.stringify(scores))
      trackCompleted(scores)
      setScreen('result')
    }, 4000)
  }

  const handleRetake = () => {
    localStorage.removeItem('neuroScanResult')
    setResult(null)
    setScreen('welcome')
  }

  return (
    <div className="app">
      <div className="app-content">
        {screen === 'welcome' && <WelcomePage onStart={handleStartQuiz} />}
        {screen === 'quiz' && <QuizPage onComplete={handleQuizComplete} />}
        {screen === 'loading' && <LoadingPage />}
        {screen === 'result' && <ResultPage result={result} onRetake={handleRetake} />}
      </div>
    </div>
  )
}
