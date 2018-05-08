import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table';
import { connect } from 'react-redux';

class AppsTable extends Component {
  render() {
    return (
      <div>
        <h1>All Games</h1>
        <Table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Name (Id)</th>
              <th>Developer</th>
              <th>Owners</th>
              <th>Score Rank</th>
              <th>Forever (avg/med)</th>
              <th>2 Weeks (avg/med)</th>
            </tr>
          </thead>

          <tbody>
            {this.props.games.map(game => (
              <tr key={game.appid}>
                <td>&nbsp;</td>
                <td>{game.name} ({game.appid})</td>
                <td>{game.developer}</td>
                <td>{game.owners}</td>
                <td>{game.score_rank}</td>
                <td>{game.average_forever} / {game.median_forever}</td>
                <td>{game.average_2weeks} / {game.average_2weeks}</td>
              </tr>
            ))}
          </tbody>
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
