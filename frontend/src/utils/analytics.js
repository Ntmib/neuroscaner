const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxlaeovjVeeSmgoCoH0zOwy35jus32UN1ikP-VKs2hLWFtzazh7dFu9wfWhO-6mfgll/exec'

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
  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...getTgUser(),
    ...data
  })

  // Google Apps Script не поддерживает CORS напрямую,
  // используем navigator.sendBeacon как основной способ,
  // fetch как фоллбэк
  try {
    const blob = new Blob([payload], { type: 'text/plain' })
    const sent = navigator.sendBeacon(WEBHOOK_URL, blob)
    if (!sent) throw new Error('beacon failed')
  } catch {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: payload
    }).catch(() => {})
  }
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
