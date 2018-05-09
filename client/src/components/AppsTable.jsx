import React, { Component } from 'react';
import { BootstrapTable as Table, TableHeaderColumn as Header } from 'react-bootstrap-table';
import { connect } from 'react-redux';

import 'react-bootstrap-table/css/react-bootstrap-table.css';

class AppsTable extends Component {
  render() {
    return (
      <div>
        <h1>All Games</h1>
        <Table data={this.props.games} striped hover pagination>
          <Header width="150" dataField="appid" isKey>App ID</Header>
          <Header width="150" dataField="developer" dataSort>Developer</Header>
          <Header width="150" dataField="publisher" dataSort>Publisher</Header>
          <Header width="150" dataField="score_rank" dataSort>Score Rank</Header>
          <Header width="150" dataField="positive" dataSort>Positive</Header>
          <Header width="150" dataField="negative" dataSort>Negative</Header>
          <Header width="150" dataField="owners">Owners</Header>
          <Header width="150" dataField="average_forever" dataSort>Avg. Forever</Header>
          <Header width="150" dataField="average_2weeks" dataSort>Avg. 2 Weeks</Header>
          <Header width="150" dataField="median_forever" dataSort>Median 2 Weeks</Header>
          <Header width="150" dataField="median_2weeks" dataSort>Median 2 Weeks</Header>
          <Header width="150" dataField="genre">Genre</Header>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    games: state.get('data').get('games').toJS()
  };
}

export default connect(mapStateToProps)(AppsTable);
