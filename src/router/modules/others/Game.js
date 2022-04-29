
const gameRouter =
{
  path: '/r3',
  hidden: true,
  component: () => import('@/views/GameR3/index'),
  name: 'GameR3',
  meta: {
    title: 'Game.R3.title',
    icon: 'component'
  }
}

export default gameRouter
