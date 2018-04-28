const requestify = require('requestify');
const cheerio = require('cheerio');

const steamSearchUrl = 'https://store.steampowered.com/search/?vrsupport=101%2C102%2C104';
const totalPage = 123;

requestify
  .get(steamSearchUrl)
  .then((response) => {
    const $ = cheerio.load(response.getBody());

    $('.search_result_row').each((i, elem) => {
      console.log($(elem).data('dsAppid'));
      console.log($(elem).find('.ellipsis .title').html())
    });
  });
