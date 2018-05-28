import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagsBar from '../components/TagsBar';
import Table from '../components/AppsTable';

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
        <TagsBar />
        <Table />
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
