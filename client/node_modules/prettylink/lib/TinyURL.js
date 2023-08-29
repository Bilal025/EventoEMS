const request = require('request');

const TINYURL_API = 'http://tinyurl.com/api-create.php?url=';

module.exports = class TinyURL {
  /**
   * Convert a long url to short url
   * @param {string} url Long url
   */
  short(longUrl) {
    this.url = longUrl;
    return new Promise((resolve, reject) => {
      request(TINYURL_API + this.url, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          reject(body);
        }
        resolve(body);
      });
    });
  }
};
