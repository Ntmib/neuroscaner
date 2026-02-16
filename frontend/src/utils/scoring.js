import { professionOrder, entryLevels } from '../data/professions'

const MIN_PERCENT = 12

/**
 * Подсчёт результатов нейросканера.
 * @param {Array} answers — массив из 6 объектов { profession: 'architect' | 'content' | 'vibecoder' | 'strategist' }
 * @returns {{ percentages, sorted, leader, entryLevel }}
 */
export function calculateScores(answers) {
  // 1. Считаем баллы
  const scores = { architect: 0, content: 0, vibecoder: 0, strategist: 0 }
  answers.forEach(a => {
    if (scores[a.profession] !== undefined) {
      scores[a.profession]++
    }
  })

  // 2. Считаем проценты
  const total = answers.length || 1
  const rawPercents = {}
  professionOrder.forEach(key => {
    rawPercents[key] = (scores[key] / total) * 100
  })

  // 3. Корректировка: минимум 12% у каждой
  const percentages = adjustMinimum(rawPercents)

  // 4. Сортировка по убыванию
  const sorted = professionOrder
    .map(key => ({ key, percent: percentages[key], score: scores[key] }))
    .sort((a, b) => b.percent - a.percent)

  const leader = sorted[0]

  // 5. Уровень входа
  const entryLevel = getEntryLevel(leader.score)

  return { percentages, sorted, leader, entryLevel, scores, answers }
}

function adjustMinimum(rawPercents) {
  const keys = Object.keys(rawPercents)
  const adjusted = { ...rawPercents }

  // Находим профессии ниже минимума
  let deficit = 0
  let surplusKeys = []

  keys.forEach(key => {
    if (adjusted[key] < MIN_PERCENT) {
      deficit += MIN_PERCENT - adjusted[key]
      adjusted[key] = MIN_PERCENT
    } else {
      surplusKeys.push(key)
    }
  })

  // Перераспределяем дефицит пропорционально
  if (deficit > 0 && surplusKeys.length > 0) {
    const surplusTotal = surplusKeys.reduce((sum, key) => sum + adjusted[key], 0)
    surplusKeys.forEach(key => {
      const share = adjusted[key] / surplusTotal
      adjusted[key] -= deficit * share
    })
  }

  // Округляем до целых, гарантируя сумму = 100
  const rounded = {}
  let sum = 0
  keys.forEach(key => {
    rounded[key] = Math.round(adjusted[key])
    sum += rounded[key]
  })

  // Компенсация ошибки округления
  const diff = 100 - sum
  if (diff !== 0) {
    // Добавляем/убираем разницу у лидера
    const leaderKey = keys.reduce((a, b) => rounded[a] >= rounded[b] ? a : b)
    rounded[leaderKey] += diff
  }

  return rounded
}

function getEntryLevel(leaderScore) {
  if (leaderScore >= 4) return entryLevels.fast
  if (leaderScore >= 3) return entryLevels.steady
  return entryLevels.strategic
}
