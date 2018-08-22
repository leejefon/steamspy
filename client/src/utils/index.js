const moment = require('moment');

export function* getTopTag(tags) {
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

export function getHourlyStatsChartLabel() {
  const end = moment(new Date());
  const current = moment(new Date()).subtract(4, 'days');
  const labels = [];

  while (current.format('MM/DD ha') !== end.format('MM/DD ha')) {
    labels.push(current.format('MM/DD ha'));
    current.add(1, 'hour');
  }
  return labels;
}

export function getHourlyStatsChartData(stats) {
  const labels = getHourlyStatsChartLabel();
  const result = {};

  const fourDaysAgo = moment(new Date()).subtract(4, 'days');

  // Initialize result obj
  labels.forEach((l) => { result[l] = ''; });
  stats.forEach((s) => {
    if (moment(s.timestamp).isBefore(fourDaysAgo)) return;

    const t = moment(s.timestamp).format('MM/DD ha');
    if (result[t] === '') {
      result[t] = parseInt(s.pastHour, 10);
    }
    // todo, for empty ones, need to use previous
  });

  let previous = 0;
  return labels.map((l) => {
    if (result[l]) {
      previous = result[l];
      return result[l];
    }
    return previous;
  });
}
