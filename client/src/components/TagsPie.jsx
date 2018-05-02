import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';

class TagsPie extends Component {
  /* eslint-disable class-methods-use-this */
  * topTag(tags) {
    const topTags = [];
    while (true) {
      let topTag = '';
      let topVote = 0;
      Object.entries(tags).forEach(([key, value]) => {
        if (value > topVote && !topTags.includes(key)) {
          topTag = key;
          topVote = value;
        }
      });
      topTags.push(topTag);
      yield topTag;
    }
  }

  reduceTags() {
    const data = this.props.games.reduce((prev, curr) => {
      const newData = Object.assign({}, prev);

      // Get top two votes
      const iterator = this.topTag(curr.tags);
      const topTag = iterator.next().value;
      const secondTopTag = iterator.next().value;

      [topTag, secondTopTag].forEach((tag) => {
        if (newData[tag]) {
          newData[tag] += 1;
        } else {
          newData[tag] = 1;
        }
      });

      return newData;
    }, {});

    return {
      labels: Object.keys(data),
      data: Object.values(data)
    };
  }

  render() {
    const { labels, data } = this.reduceTags();

    const dataset = {
      labels,
      datasets: [{
        data,
        label: 'Tags',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)'
      }]
    };

    return (
      <Bar
        data={dataset}
        width={100}
        height={50}
        options={{
          maintainAspectRatio: false
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    games: state.get('data').get('games').toJS()
  };
}

export default connect(mapStateToProps)(TagsPie);
