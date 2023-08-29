const request = require('request');

const REURL_API = 'https://api.reurl.cc/';

module.exports = class Reurl {
  /**
   * Create Reurl client and initialize apikey
   * @param {string} apikey Reurl apikey
   */
  constructor(apikey) {
    this.apikey = apikey;
  }

  /**
   * Initialize apikey
   * @param {string} apikey Reurl apikey
   */
  init(apikey) {
    this.apikey = apikey;
  }

  /**
   * Convert a long url to short url
   * @param {string} longUrl Long url
   */
  short(longUrl) {
    return new Promise((resolve, reject) => {
      request({
        url: `${REURL_API}shorten`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'reurl-api-key': this.apikey,
        },
        json: {
          url: longUrl,
        },
      }, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          reject(body);
        }
        resolve(body);
      });
    });
  }
};
