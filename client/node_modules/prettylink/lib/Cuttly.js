const request = require('request');

const CUTTLY_API = 'https://cutt.ly/api/api.php?';

module.exports = class Cuttly {
  /**
   * Create Cuttly client and initialize apikey
   * @param {string} apikey Cuttly apikey
   */
  constructor(apikey) {
    this.apikey = apikey;
  }

  /**
   * Initialize apikey
   * @param {string} apikey Cuttly apikey
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
      request(
        CUTTLY_API + 'key=' + this.apikey + '&short=' + longUrl,
        (err, res, body) => {
          if (err) {
            reject(body);
          }
          resolve(body);
        }
      );
    });
  }
};
