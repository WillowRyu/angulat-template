import { createReducer, on } from '@ngrx/store';
import { 
    CollectionApiActions,
    CollectionPageActions
} from '../actions'

export interface State {
  loaded: boolean;
  loading: boolean;
  ids: string[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  ids: []
};

export const reducer = createReducer(
  initialState,
  on(CollectionPageActions.loadCollections, state => ({
    ...state,
    loading: true
  })),
  on(CollectionApiActions.collectionLoadSuccess, (state, { books }) => ({
      loaded: true,
      loading: false,
      ids: books.map(book => book.id)
  })),
  on(
    CollectionApiActions.addBookSuccess,
    CollectionApiActions.removeBookFailure,
    (state, { book }) => {
      if (state.ids.indexOf(book.id) > -1) {
        return state;
      }
      return {
        ...state,
        ids: [...state.ids, book.id]  
      };
    }
  ),
  on(
    CollectionApiActions.removeBookSuccess,
    CollectionApiActions.addBookFailure,
    (state, { book }) => ({
      ...state,
      ids: state.ids.filter(id => id !== book.id)
    })
  )
);

export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getIds = (state:State) => state.ids;

