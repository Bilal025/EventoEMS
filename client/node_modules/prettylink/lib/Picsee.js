const request = require('request');

const PICSEE_API = 'https://api.pics.ee/v1/';

module.exports = class Picsee {
  /**
   * Create PicSee client and initialize accessToken
   * @param {string} accessToken PicSee accessToken
   */
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Initialize accessToken
   * @param {string} accessToken PicSee accessToken
   */
  init(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Convert a long url to short url
   * @param {string} longUrl Long url
   */
  short(longUrl) {
    return new Promise((resolve, reject) => {
      request({
        url: `${PICSEE_API}links/?access_token=${this.accessToken}`,
        method: 'POST',
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

  /**
   * Custom short url meta info
   * @param {string} longUrl Long url
   * @param {string} title Meta info title
   * @param {string} description Meta info description
   * @param {string} imageUrl Meta info imgUrl
   */
  customShortUrlMeta(longUrl, title, description = '', imageUrl) {
    return new Promise((resolve, reject) => {
      request({
        url: `${PICSEE_API}links/?access_token=${this.accessToken}`,
        method: 'POST',
        json: {
          url: longUrl,
          title,
          description,
          imageUrl,
        },
      }, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          reject(body);
        }
        resolve(body);
      });
    });
  }

  /**
   * Get short url overview info
   * @param {string} linkId PicSee link id, like this 'KK6X6'
   */
  getOverview(linkId) {
    return new Promise((resolve, reject) => {
      request({
        url: `${PICSEE_API}links/${linkId}/overview?access_token=${this.accessToken}`,
        method: 'GET',
      }, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          reject(body);
        }
        resolve(body);
      });
    });
  }
};
