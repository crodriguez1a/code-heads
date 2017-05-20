const articles: Array = [
  {
    title: 'A Practical Approach',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    title: 'Keep Learning Free',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    title: 'Contributors & Curators',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
  },
  {
    title: 'Start Learning on Your Own',
    description: 'Hello glimmer-redux',
    teaser: 'read more',
    read: false,
    markdown: './-utils/md/articles/foo.md'
  }
];

export default function ArticlesReducer (state=articles, action) {
  // TODO where would an async fetch belong? 
  switch (action.type) {
    case 'MARK_AS_READ':
      return state.map((article, index) => {
        if (index === action.index) {
          return {...article, read: true}
        }
        return article
      })
    default:
      return state
  }
};
