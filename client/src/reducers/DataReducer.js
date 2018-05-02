import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  games: []
});

function dataReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_GAMES':
      return state.merge({
        games: action.data
      });
    default:
      return state;
  }
}

export default dataReducer;
