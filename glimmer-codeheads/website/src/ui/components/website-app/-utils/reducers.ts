import { content } from './content';

export default function ArticlesReducer (state=content, action) {
  switch (action.type) {
    case 'HIGHLIGHT_ARTICLE':
      return state.map((article, index) => {
        if (index === action.index) {
          return {...article, highlighted: true};
        }

        return article;
      })
    case 'UNHIGHLIGHT_ARTICLE':
      return state.map((article, index) => {
        if (index === action.index) {
          return {...article, highlighted: false};
        }

        return article;
      })
    default:
      return state
  }
};
