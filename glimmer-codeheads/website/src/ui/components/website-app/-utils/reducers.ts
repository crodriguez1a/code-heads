// TODO import all the content as the state
import { articles } from './content';

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
