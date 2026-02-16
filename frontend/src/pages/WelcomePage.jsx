import '../styles/welcome.css'

export default function WelcomePage({ onStart }) {
  return (
    <div className="welcome fade-in">
      <div className="welcome-icon">
        <div className="welcome-icon-glow" />
        <span>🧠</span>
      </div>

      <h1 className="welcome-title">НейроСканер 2026</h1>
      <p className="welcome-tagline">На чём ты заработаешь в 2026?</p>

      <p className="welcome-subtitle">
        За 2 минуты покажу, какая нейропрофессия подходит тебе больше всего
        и где ты быстрее всего выйдешь на доход.
      </p>

      <div className="welcome-features">
        <div className="welcome-feature">
          <span className="feature-icon">✔️</span>
          <span>Разбивку по 4 денежным ролям</span>
        </div>
        <div className="welcome-feature">
          <span className="feature-icon">✔️</span>
          <span>Свою основную траекторию</span>
        </div>
        <div className="welcome-feature">
          <span className="feature-icon">✔️</span>
          <span>Уровень дохода через 3–6 месяцев</span>
        </div>
        <div className="welcome-feature">
          <span className="feature-icon">✔️</span>
          <span>Рекомендации, с чего начать</span>
        </div>
      </div>

      <button className="welcome-btn" onClick={onStart}>
        <span>Начать сканирование</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <p className="welcome-hint">Займёт 2 минуты • 6 вопросов</p>
    </div>
  )
}
