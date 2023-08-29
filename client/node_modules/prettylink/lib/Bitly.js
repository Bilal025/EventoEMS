const request = require('request');

const BITLY_API = 'https://api-ssl.bitly.com/v4/';

module.exports = class Bitly {
  /**
   * Create Bitly client and initialize accessToken
   * @param {string} accessToken Bitly accessToken
   */
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Initialize accessToken
   * @param {string} accessToken Bitly accessToken
   */
  init(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Convert a bitlink short url to short url
   * @param {string} longUrl Long url
   */
  short(longUrl) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}shorten`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        json: {
          long_url: longUrl,
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
   * Convert a bitlink short url to original link
   * @param {string} bitlinkId A Bitlink made of the domain and hash
   */
  expand(bitlinkId) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}expand`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        json: {
          bitlink_id: bitlinkId,
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
   * Get metrics about the countries referring click traffic to a single Bitlink.
   * @param {string} bitlink A Bitlink made of the domain and hash
   * @param {string} unit A unit of time
   * @param {number} units An integer representing the time units to query data for.
   * pass -1 to return all units of time.
   * @param {number} size The quantity of items to be be returned
   */
  getCountries(bitlink, unit = 'day', units = -1, size = 50) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}bitlinks/${bitlink}/countries?unit=${unit}&units=${units}&size=${size}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
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
   * Get metrics about the referrers referring click traffic to a single Bitlink.
   * @param {string} bitlink A Bitlink made of the domain and hash
   * @param {string} unit A unit of time
   * @param {number} units An integer representing the time units to query data for.
   * pass -1 to return all units of time.
   * @param {number} size The quantity of items to be be returned
   */
  getReferrers(bitlink, unit = 'day', units = -1, size = 50) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}bitlinks/${bitlink}/referrers?unit=${unit}&units=${units}&size=${size}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
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
   * Get metrics about rollup the click counts to a referrer about a single Bitlink.
   * @param {string} bitlink A Bitlink made of the domain and hash
   * @param {string} unit A unit of time
   * @param {number} units An integer representing the time units to query data for.
   * pass -1 to return all units of time.
   * @param {number} size The quantity of items to be be returned
   */
  getReferrersDomains(bitlink, unit = 'day', units = -1, size = 50) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}bitlinks/${bitlink}/referrers_by_domains?unit=${unit}&units=${units}&size=${size}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
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
   * Get click counts for a specified Bitlink, This rolls up all the data
   * into a single field of clicks.
   * @param {string} bitlink A Bitlink made of the domain and hash
   * @param {string} unit A unit of time
   * @param {number} units An integer representing the time units to query data for.
   * pass -1 to return all units of time.
   * @param {number} size The quantity of items to be be returned
   */
  getClickSummary(bitlink, unit = 'day', units = -1, size = 50) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}/bitlinks/${bitlink}/clicks/summary?unit=${unit}&units=${units}&size=${size}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
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
   * Get click counts for a specified Bitlink, This returns an array with clicks based on a date.
   * @param {string} bitlink A Bitlink made of the domain and hash
   * @param {string} unit A unit of time
   * @param {number} units An integer representing the time units to query data for.
   * pass -1 to return all units of time.
   * @param {number} size The quantity of items to be be returned
   */
  getClick(bitlink, unit = 'day', units = -1, size = 50) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}/bitlinks/${bitlink}/clicks?unit=${unit}&units=${units}&size=${size}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
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
   * Get information for a Bitlink.
   * @param {string} bitlink A Bitlink made of the domain and hash
   */
  getLinkInfo(bitlink) {
    return new Promise((resolve, reject) => {
      request({
        url: `${BITLY_API}bitlinks/${bitlink}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
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
