const commentsRouter =
{
  path: 'Comments',
  component: () => import('@/views/blank'),
  name: 'comments',
  meta: {
    title: 'comments.title',
    icon: 'community_line'
  }, children: [
    {
      path: 'Notice',
      component: () => import('@/views/Comments'),
      meta: {
        title: 'comments.notice.title',
        icon: 'dispose'
      }
    }, {
      path: 'bbs',
      component: () => import('@/views/Comments'),
      meta: {
        title: 'comments.bbs.title',
        icon: 'group'
      }
    }, {
      path: 'suggest',
      component: () => import('@/views/Suggest'),
      meta: {
        title: 'comments.suggest.title',
        icon: 'dispose'
      }
    }]
}

export default commentsRouter
