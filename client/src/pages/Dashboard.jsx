import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagsPie from '../components/TagsPie';

class Dashboard extends Component {
  componentDidMount() {
    fetch('/games')
      .then(response => response.json())
      .then((data) => {
        this.props.dispatch({
          type: 'SET_GAMES',
          data
        });
      });
  }

  render() {
    return (
      <div className="container">
        <h1>Steam Games</h1>
        <TagsPie />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    games: state.get('data').get('games').toJS()
  };
}

export default connect(mapStateToProps)(Dashboard);
