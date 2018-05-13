import React, { Component } from 'react';
import { BootstrapTable as Table, TableHeaderColumn as Header } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import TagCloud from '../components/TagCloud';

class AppsTable extends Component {
  constructor() {
    super();

    this.state = {
      filterByTag: {}
    };
  }

  updateTagFilter(filterByTag) {
    this.setState({ filterByTag });
  }

  render() {
    const options = {
      paginationSize: 10,
      sizePerPage: 50
    };

    const data = this.props.games.filter(game => !this.state.filterByTag.value ||
      Object.keys(game.tags).includes(this.state.filterByTag.value));

    const title = this.state.filterByTag.value ? (
      <h1><b>{this.state.filterByTag.value}</b> Games</h1>
    ) : (
      <h1>All Games</h1>
    );

    return (
      <div>
        {title}
        <TagCloud onClick={tag => this.updateTagFilter(tag)} />
        <Table data={data} striped hover pagination search options={options}>
          <Header width="80" dataField="appid" isKey>App ID</Header>
          <Header width="160" dataField="developer" dataSort>Developer</Header>
          <Header width="160" dataField="publisher" dataSort>Publisher</Header>
          <Header width="110" dataField="score_rank" dataSort>Score Rank</Header>
          <Header width="100" dataField="positive" dataSort>Positive</Header>
          <Header width="100" dataField="negative" dataSort>Negative</Header>
          <Header width="100" dataField="owners">Owners</Header>
          <Header width="120" dataField="average_forever" dataSort>Avg. Forever</Header>
          <Header width="120" dataField="average_2weeks" dataSort>Avg. 2 Weeks</Header>
          <Header width="150" dataField="median_forever" dataSort>Median 2 Weeks</Header>
          <Header width="150" dataField="median_2weeks" dataSort>Median 2 Weeks</Header>
          <Header width="250" dataField="genre">Genre</Header>
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
