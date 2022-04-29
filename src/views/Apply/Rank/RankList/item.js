export function itemMapper(i, levelDescFunc) {
  if (i.rank < 0) i.rank = 1e5
  if (i.lastRank < 0) i.lastRank = 1e5
  const dir = -Math.sign(i.rank - i.lastRank) + 1
  return Object.assign(i, {
    title: i.realName,
    direction: ['down', 'balance', 'up'][dir],
    levelDesc: levelDescFunc(i.level),
    href: `#/user/profile?id=${i.user}`
  })
}
