const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxrydpRm3hJFXagzAGcSqr75mVcwlMLEFtjG9uaDDHEhDQvu9_NvgoT0nFMVbL34HaX/exec'

const tg = window.Telegram?.WebApp

function getTgUser() {
  const user = tg?.initDataUnsafe?.user
  return {
    tg_id: user?.id || '',
    tg_username: user?.username || '',
    tg_name: user?.first_name || ''
  }
}

function send(data) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      ...getTgUser(),
      ...data
    })
  }).catch(() => {})
}

export function trackStarted() {
  send({ event: 'started' })
}

export function trackCompleted(result) {
  send({
    event: 'completed',
    architect: result.percentages.architect,
    content: result.percentages.content,
    vibecoder: result.percentages.vibecoder,
    strategist: result.percentages.strategist,
    leader: result.leader.key,
    entry_level: result.entryLevel.id
  })
}
