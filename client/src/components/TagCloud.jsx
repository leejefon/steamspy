import React, { Component } from 'react';
import { TagCloud as Cloud } from 'react-tagcloud';
import { connect } from 'react-redux';
import * as Utils from '../utils';

class TagCloud extends Component {
  getTags() {
    const data = this.props.games.reduce((prev, curr) => {
      const newData = Object.assign({}, prev);
      const iterator = Utils.getTopTag(curr.tags);
      const topTag = iterator.next().value;

      if (newData[topTag]) {
        newData[topTag] += 1;
      } else {
        newData[topTag] = 1;
      }

      return newData;
    }, {});

    return Object.keys(data).map(key => ({
      value: key,
      count: data[key]
    }));
  }

  render() {
    const data = this.getTags();

    const options = {
      luminosity: 'light',
      hue: 'blue'
    };

    return (
      <Cloud
        minSize={12}
        maxSize={35}
        tags={data}
        colorOptions={options}
        style={{ cursor: 'pointer' }}
        onClick={this.props.onClick}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    games: state.get('data').get('games').toJS()
  };
}

export default connect(mapStateToProps)(TagCloud);
