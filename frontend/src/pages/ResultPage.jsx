import { useState, useEffect, useRef } from 'react'
import { professions } from '../data/professions'
import '../styles/result.css'

function AnimatedBar({ percent, color, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percent), 100 + delay)
    return () => clearTimeout(timer)
  }, [percent, delay])

  return (
    <div className="bar-track" ref={ref}>
      <div
        className="bar-fill"
        style={{
          width: `${width}%`,
          background: color,
          transitionDelay: `${delay}ms`
        }}
      />
    </div>
  )
}

function AnimatedNumber({ target, duration = 1200 }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return <span>{current}%</span>
}

export default function ResultPage({ result, onRetake }) {
  if (!result) return null

  const { sorted, leader, entryLevel } = result
  const leaderProf = professions[leader.key]

  return (
    <div className="result slide-up">
      {/* Нейропрофиль */}
      <div className="result-header">
        <span className="result-badge">🔍 Твой нейропрофиль 2026</span>
      </div>

      <div className="result-bars">
        {sorted.map((item, i) => {
          const prof = professions[item.key]
          const isLeader = i === 0
          return (
            <div key={item.key} className={`result-bar-row ${isLeader ? 'leader' : ''}`}>
              <div className="result-bar-label">
                <span className="result-bar-icon">{prof.icon}</span>
                <span className="result-bar-name">{prof.title}</span>
                <span className="result-bar-percent">
                  <AnimatedNumber target={item.percent} />
                </span>
              </div>
              <AnimatedBar percent={item.percent} color={prof.colorHex} delay={i * 200} />
            </div>
          )
        })}
      </div>

      {/* Основная траектория */}
      <div className="result-main" style={{ '--prof-color': leaderProf.colorHex }}>
        <div className="result-main-header">
          <span className="result-main-icon">{leaderProf.icon}</span>
          <div>
            <div className="result-main-badge">🥇 Твоя основная денежная траектория</div>
            <h2 className="result-main-title">{leaderProf.title}</h2>
          </div>
        </div>

        <p className="result-main-subtitle">{leaderProf.subtitle}</p>
        <ul className="result-traits">
          {leaderProf.traits.map((t, i) => <li key={i}>— {t}</li>)}
        </ul>

        {/* Какой ты будешь */}
        <div className="result-cool">
          <p>{leaderProf.coolFactor}</p>
        </div>

        <div className="result-section">
          <h3>💼 За что тебе будут платить:</h3>
          <ul>
            {leaderProf.payFor.map((t, i) => <li key={i}>— {t}</li>)}
          </ul>
        </div>

        <div className="result-section">
          <h3>⚡ Как ты сможешь зарабатывать:</h3>
          <ul>
            {leaderProf.howToEarn.map((t, i) => <li key={i}>— {t}</li>)}
          </ul>
        </div>

        {/* Доход — лесенка роста */}
        <div className="result-income-breakdown">
          <h3>💰 Твой потенциал дохода:</h3>
          <div className="income-steps">
            <div className="income-step">
              <span className="income-step-label">За проект</span>
              <span className="income-step-value">{leaderProf.incomeProject}</span>
            </div>
            <div className="income-step income-step-medium">
              <span className="income-step-label">В месяц</span>
              <span className="income-step-value">{leaderProf.incomeMonth}</span>
            </div>
            <div className="income-step income-step-big">
              <span className="income-step-label">В год</span>
              <span className="income-step-value">{leaderProf.incomeYear}</span>
            </div>
          </div>
          <p className="income-disclaimer">
            * Все цифры — реальный потенциал при пошаговой системе и твоих активных действиях. Результат зависит от тебя.
          </p>
        </div>
      </div>

      {/* Уровень входа */}
      <div className="result-level">
        <div className="result-level-header">
          <span className="result-level-icon">{entryLevel.icon}</span>
          <div>
            <div className="result-level-badge">🚀 Твой уровень входа</div>
            <h3 className="result-level-title">{entryLevel.title}</h3>
          </div>
        </div>
        <p className="result-level-desc">{entryLevel.description}</p>
      </div>

      {/* Дополнительные силы */}
      <div className="result-secondary">
        <h3 className="result-secondary-title">🧩 Твои дополнительные силы</h3>
        {sorted.slice(1).map(item => {
          const prof = professions[item.key]
          return (
            <div key={item.key} className="result-secondary-card" style={{ '--prof-color': prof.colorHex }}>
              <div className="result-secondary-header">
                <span>{prof.icon}</span>
                <span className="result-secondary-name">{prof.title}</span>
                <span className="result-secondary-percent">{item.percent}%</span>
              </div>
              <p className="result-secondary-desc">{prof.shortDescription}</p>
            </div>
          )
        })}
      </div>

      {/* Мотивация */}
      <div className="result-motivation">
        <p>
          <strong>⚡ Важно:</strong> Ты не «одна профессия».
          Но начинать лучше с той, где твой процент выше всего — там быстрее всего будет результат.
        </p>
      </div>

      {/* CTA */}
      <div className="result-cta">
        <div className="result-cta-glow" />
        <h3>🎓 20–22 февраля на Нейроконцентрате</h3>
        <p className="result-cta-subtitle">
          «Лучшие нейропрофессии и навыки для заработка в 2026»
        </p>
        <ul className="result-cta-list">
          <li>— глубоко разберём каждую роль</li>
          <li>— покажем тебе пошаговую модель входа</li>
          <li>— расскажем, где искать клиентов</li>
          <li>— дадим стратегию масштабирования</li>
        </ul>
        <p className="result-cta-hook">
          Сканер показал тебе направление.<br/>
          На Нейроконцентрате мы соберём твою систему.
        </p>
        <a
          className="result-cta-btn"
          href="https://t.me/+MtxwAvatx0lkYWU6"
          target="_blank"
          rel="noopener noreferrer"
        >
          Принять участие
        </a>
      </div>

      {onRetake && (
        <button className="result-retake" onClick={onRetake}>
          Пройти заново
        </button>
      )}
    </div>
  )
}
