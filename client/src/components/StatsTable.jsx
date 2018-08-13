import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Table from 'react-bootstrap/lib/Table';
import { connect } from 'react-redux';
import TrendChart from './TrendChart';

class StatsTable extends Component {
  render() {
    if (!this.props.data) return null;

    const app = this.props.data.toJS();

    return (
      <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Header>
          <Modal.Title>{app.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <TrendChart />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Month</th>
                <th>Avg. Players</th>
                <th>Gain</th>
                <th>% Gain</th>
                <th>Peak Players</th>
              </tr>
            </thead>

            <tbody>
              {app.stats.map(stat => (
                <tr key={Math.random()}>
                  <td>{stat.month}</td>
                  <td>{stat.avgPlayers}</td>
                  <td>{stat.gain}</td>
                  <td>{stat.percentGain}</td>
                  <td>{stat.peakPlayers}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    show: state.get('ui').get('showStatsModal'),
    data: state.get('ui').get('selectedGame')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    close() {
      dispatch({
        type: 'TOGGLE_STATS_MODAL',
        show: false,
        data: null
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsTable);
