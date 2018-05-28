import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import * as Utils from '../utils';

class TagsBar extends Component {
  reduceTags() {
    const data = this.props.games.reduce((prev, curr) => {
      const newData = Object.assign({}, prev);

      // Get top two votes
      const iterator = Utils.getTopTag(curr.tags);
      const topTag = iterator.next().value;
      const secondTopTag = iterator.next().value;

      [topTag/*, secondTopTag */].forEach((tag) => {
        if (newData[tag]) {
          newData[tag] += 1;
        } else {
          newData[tag] = 1;
        }
      });

      return newData;
    }, {});

    const result = {};
    Object.keys(data).forEach((key) => {
      if (!key) return;
      if (data[key] > 1) result[key] = data[key];
    });

    return {
      labels: Object.keys(result),
      data: Object.values(result)
    };
  }

  render() {
    const { labels, data } = this.reduceTags();

    const dataset = {
      labels,
      datasets: [{
        data,
        label: '# of Games',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)'
      }]
    };

    return (
      <div style={{ height: 480 }}>
        <Bar
          data={dataset}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false
                }
              }]
            }
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    games: state.get('data').get('games').toJS()
  };
}

export default connect(mapStateToProps)(TagsBar);
