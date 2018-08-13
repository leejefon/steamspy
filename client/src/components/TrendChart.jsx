import React, { Component } from 'react';
import { connect } from 'react-redux';

class TrendChart extends Component {
  render() {
    if (!this.props.data) return null;

    const app = this.props.data.toJS();

    return (
      <div>
        <h3>Trend Chart goes here</h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.get('ui').get('selectedGame')
  };
}

export default connect(mapStateToProps)(TrendChart);
