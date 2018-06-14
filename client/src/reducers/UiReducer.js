import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  showStatsModal: false,
  selectedGame: null
});

function uiReducer(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_STATS_MODAL':
      return state.merge({
        showStatsModal: action.show,
        selectedGame: action.data
      });
    default:
      return state;
  }
}

export default uiReducer;
