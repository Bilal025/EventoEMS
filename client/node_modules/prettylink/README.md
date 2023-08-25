# 🔗Pretty-Link : A powerful Node.js short URL library

[![npm](https://img.shields.io/npm/v/prettylink)](https://www.npmjs.com/package/prettylink)
[![npm](https://img.shields.io/npm/dm/prettylink)](https://www.npmjs.com/package/prettylink)
[![Node version](https://img.shields.io/badge/node.js->=_8.0-green.svg)](https://nodejs.org/download/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Test Status](https://github.com/stu01509/pretty-link/actions/workflows/pull-request.yml/badge.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## Installation

In order to use Pretty-Link, make sure that you have Node version 8.0.0 or higher.

```shell
npm install prettylink
```

Or Yarn.

```shell
yarn add prettylink
```

## Usage

Pretty-Link this module provides five URL shorten service, such as [Bitly](https://bitly.com/), [TinyURL](https://tinyurl.com/), [PicSee](https://picsee.co/), [reurl](https://reurl.cc/main/tw) and [Pixnet0rz.tw](http://0rz.tw/), to calls to their API for Node.js

For more information on the Token applicant or API request and responses please checkout [API Info](#API-Info) or visit their official guide.

```js
const prettylink = require('prettylink');

// Init Access Token in constructor 
const bitly = new prettylink.Bitly('BitlyAccessToken');
// Or use init function
bitly.init('BitlyAccessToken');
bitly.short('https://github.com/stu01509/pretty-link').then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});

```

See [`examples`](examples) folder for more detail examples.

## API Info

### `Bitly`

 [Bitly Official API docs](https://dev.bitly.com/v4_documentation.html)
 [Bitly Access Token generate](https://www.youtube.com/watch?v=Bdq9vcQ8vfw&)

* `bitly.init(AccessToken)` - Initialize AccessToken.
* `bitly.short(longUrl)` - Convert a long url to short url.
* `bitly.expand(bitlinkId)` - Convert a bitlink short url to original link.
* `bitly.getCountries(bitlink, unit, units, size)` - Get metrics about the countries referring click traffic to a single Bitlink.
* `bitly.getReferrers(bitlink, unit, units, size)` - Get metrics about the referrers referring click traffic to a single Bitlink.
* `bitly.getReferrersDomains(bitlink, unit, units, size)` - Get metrics about rollup the click counts to a referrer about a single Bitlink.
* `bitly.getClickSummary(bitlink, unit, units, size)` - Get click counts for a specified Bitlink, This rolls up all the data
* `bitly.getClick(bitlink, unit, units, size)` - Get click counts for a specified Bitlink, This returns an array with clicks based on a date.
* `bitly.getLinkInfo(bitlink)` - Get information for a Bitlink.

`📌 Pretty-Link only supports Bitly's v4 API, not Compatible v3 API`

### `TinyURL`

* `tinyUrl.short(longUrl)` - Convert a long url to short url.

### `PicSee`

[PicSee Official API docs](https://picsee.co/developers/)

* `picsee.init(AccessToken)` - Initialize AccessToken.
* `picsee.short(longUrl)` - Convert a long url to short url.
* `picsee.customShortUrlMeta(longUrl, title, description, imageUrl)` - Custom short url meta info.
* `picsee.getOverview(linkId)` - Get short url overview info, PicSee link id, like this 'KK6X6'.

### `reurl`

[reurl Official API docs](https://reurl.cc/info/tw/api)

* `reurl.init(AccessToken)` - Initialize AccessToken.
* `reurl.short(longUrl)` - Convert a long url to short url.

### `Cutt.ly`

[Cutt.ly Official API docs](https://cutt.ly/api-documentation/cuttly-links-api)

* `cuttly.init(AccessToken)` - Initialize AccessToken.
* `cuttly.short(longUrl)` - Convert a long url to short url.

### `Pixnet0rz.tw`

* `pixnet0rz.short(longUrl)` - Convert a long url to short url.

## Demo

![Demo](https://imgur.com/FjKL1a2.gif)

## Test

⚠️ To run Mocha tests type `npm test`. Please note the test will fail if you don't replace your own API key or Access Token.

## Contributing

🎉 Welcome to Directly send PRs!

## License

[MIT](LICENSE)
