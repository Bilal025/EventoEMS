const request = require('request');
const cheerio = require('cheerio');

const PIXNET0RZ_URL = 'http://0rz.tw/create?';

module.exports = class Pixnet0rz {
  /**
   * Convert a long url to short url
   * @param {string} longUrl Long url
   */
  short(longUrl) {
    this.url = longUrl;
    return new Promise((resolve, reject) => {
      request({
        url: PIXNET0RZ_URL,
        method: 'POST',
        formData: { url: this.url },
      }, (createErr, createRes, createBody) => {
        if (createErr || createRes.statusCode !== 302) {
          reject(new Error('Can\'t submit url'));
        }
        request({
          url: `${PIXNET0RZ_URL}url=${this.url}`,
          method: 'GET',
        }, (err, res, body) => {
          if (err || res.statusCode !== 200) {
            reject(new Error('Can\'t get result'));
          }
          const $ = cheerio.load(body);
          const resultUrl = $('#doneurl > a').attr('href');
          if (resultUrl === undefined) {
            reject(new Error('Can\'t get result'));
          }
          resolve(resultUrl);
        });
      });
    });
  }
};
