/*
  Copyright 2017 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const path = require('path');
const escapeForRegex = require('./escape-for-regex');

/**
   * Transforms manifest entries to work with Next JS
   *
   * @param {Object} config
   * @param {Array} manifestEntries The Array of Entries of files
   * to be pre-cached by workbox
   * @return {Array<workbox.build.ManifestEntry>}
   */
module.exports = ({buildId, swDest}, manifestEntries) => {
    const pattern = new RegExp(/\.(js|css|html)$/);
    const notPattern = new RegExp(`${escapeForRegex(path.basename(swDest))}$`);
    return manifestEntries.filter((entry) =>
        pattern.test(entry.url)
        && ! notPattern.test(entry.url)
    ).map((entry) => {
        let newEntry = Object.assign({}, entry);
        let tempUrl = entry.url;

        if (pattern.test(entry.url) && ! notPattern.test(entry.url)) {
            // next ^5 and ^6 pages
            tempUrl = tempUrl.replace(`bundles/pages`, `_next/${buildId}/page`);
            // next ^6 main js file
            tempUrl = tempUrl.replace(`static/commons`, `_next/static/commons`);
            // next ^5 main js file
            tempUrl = tempUrl.replace(`main.js`, `_next/${buildId}/main.js`);
        }

        newEntry.url = tempUrl;

        return newEntry;
    });
};
