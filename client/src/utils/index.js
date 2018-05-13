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

export const tempt = '';
