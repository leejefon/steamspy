import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../actions';

class Dashboard extends Component {
  render() {
    return (
      <div className="container">
        <h1>Steam Games</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    uiState: state.get('uiReducer').toJS()
  };
}

export default connect(mapStateToProps)(Dashboard);
