// TODO import all the content as the state
import { content } from './content';

export default function ArticlesReducer (state=content, action) {
  // TODO where would an async fetch belong?
  switch (action.type) {
    case 'MARK_AS_READ':
      return state.map((article, index) => {
        if (index === action.index && article.hasOwnProperty('read')) {
          return {...article, read: true}
        }
        return article
      })
    default:
      return state
  }
};
