import React, { Component } from 'react';
import { BootstrapTable as Table, TableHeaderColumn as Header } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import TagCloud from '../components/TagCloud';
import * as Utils from '../utils';

import '../css/custom.scss';

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

  topThreeTags(game) {
    const iterator = Utils.getTopTag(game.tags);
    const first = iterator.next().value;
    const second = iterator.next().value;
    const third = iterator.next().value;

    return [first, second, third];
  }

  render() {
    const options = {
      defaultSortName: 'score_rank',
      defaultSortOrder: 'desc',
      paginationSize: 10,
      sizePerPage: 50
    };

    const selectRowProp = {
      mode: 'checkbox',
      bgColor: 'pink',
      hideSelectColumn: true,
      clickToSelect: true,
      showOnlySelected: true
    };

    const data = this.props.games
      .filter(game => !this.state.filterByTag.value ||
        Object.keys(game.tags).includes(this.state.filterByTag.value))
      .map(game => Object.assign({}, game, { topTags: this.topThreeTags(game).join(', ') }));

    const title = this.state.filterByTag.value ? (
      <h2><b>{this.state.filterByTag.value}</b> Games</h2>
    ) : (
      <h2>All Games</h2>
    );

    const nameFormatter = (cell, row) => (
      <a href={`https://store.steampowered.com/app/${row.appid}`} target="_blank">{cell}</a>
    );

    return (
      <div>
        {title}
        <TagCloud onClick={tag => this.updateTagFilter(tag)} />
        <div style={{ margin: 30 }} />
        <Table data={data} striped hover pagination search options={options} bodyStyle={{ cursor: 'pointer' }} selectRow={selectRowProp}>
          <Header width="80" dataField="appid" isKey>App ID</Header>
          <Header width="200" dataField="name" dataFormat={nameFormatter} dataSort>Name</Header>
          <Header width="200">Empty Col Hack for Fixed Col</Header>

          <Header width="160" dataField="developer" dataSort>Developer</Header>
          <Header width="160" dataField="publisher" dataSort>Publisher</Header>
          <Header width="250" dataField="topTags" dataSort>Top Tags</Header>
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
