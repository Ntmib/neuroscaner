import { useState, useEffect } from 'react'
import '../styles/loading.css'

const steps = [
  'Анализирую ответы',
  'Считаю нейропрофиль',
  'Определяю траекторию'
]

export default function LoadingPage() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 1500)
    const timer2 = setTimeout(() => setActiveStep(2), 3000)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="loading">
      <div className="loading-scanner">
        <div className="loading-scanner-ring" />
        <div className="loading-scanner-ring ring-2" />
        <div className="loading-scanner-core">🧠</div>
      </div>
      <h2 className="loading-title">Сканирую твой профиль...</h2>
      <div className="loading-steps">
        {steps.map((text, i) => {
          let cls = 'loading-step'
          if (i < activeStep) cls += ' done'
          else if (i === activeStep) cls += ' active'
          return (
            <div key={i} className={cls}>
              <span className={`loading-dot${i === activeStep ? ' pulse' : ''}`} />
              <span>{i < activeStep ? '✓ ' : ''}{text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
