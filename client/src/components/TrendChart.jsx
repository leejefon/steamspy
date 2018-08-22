import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import * as Utils from '../utils';

class TrendChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: null
    };
  }

  componentWillMount() {
    const data = this.props.data.toJS();
    if (data.appid) {
      fetch(`/hourlyStats/${data.appid}`)
        .then(response => response.json())
        .then((stats) => {
          this.setState({ stats });
        });
    }
  }

  render() {
    if (!this.state.stats) return null;

    const data = {
      labels: Utils.getHourlyStatsChartLabel(),
      datasets: [
        {
          data: Utils.getHourlyStatsChartData(this.state.stats),
          label: 'Number of Players',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10
        }
      ]
    };

    return (
      <Line data={data} />
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.get('ui').get('selectedGame')
  };
}

export default connect(mapStateToProps)(TrendChart);
