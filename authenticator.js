#!/usr/bin/env node

'use strict';

const https = require('https');
const token = process.env.GANDI_API_TOKEN;

if (!token) {
    console.error('You must set GANDI_API_TOKEN environment variable.');
    process.exit(1);
}

if (!process.env.CERTBOT_DOMAIN || !process.env.CERTBOT_VALIDATION) {
    console.error('This script is to be called by Certbot.');
    process.exit(1);
}

const parts = process.env.CERTBOT_DOMAIN.match(/^((.*)\.)?(.*\..*)$/);
const domain = parts[3];
const sub = parts[2];
const name = '_acme-challenge' + (sub ? '.' + sub : '');
const url = `https://dns.api.gandi.net/api/v5/domains/${domain}/records/${name}/TXT`;

Promise.resolve()
    .then(getExistingValues)
    .then(deleteExistingValues)
    .then(postValues)
    .then(function () {
        // needed by cleanup.js
        console.log(url);
    })
    .catch(function (e) {
        console.log(e);
        process.exit(1);
    })
;

function postValues(values) {
    return new Promise(function (resolve, reject) {
        values.push(process.env.CERTBOT_VALIDATION);
        const body = JSON.stringify({
            rrset_ttl: 10800,
            rrset_values: values
        });
        const options = {
            method: 'POST',
            headers: {
                'X-Api-Key': token,
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        };
        const req = https.request(url, options, function (res) {
            /2[0-9]{2}/.test(res.statusCode) ? resolve(values) : reject(`${res.statusCode} ${res.statusMessage}`);
        });
        req.on('error', function (e) {
            reject(`request error: ${e.message}`);
        });
        req.write(body);
        req.end();
    });
}

function deleteExistingValues(values) {
    return new Promise(function (resolve, reject) {
        if (values.length) {
            const options = {
                method: 'DELETE',
                headers: {
                    'X-Api-Key': token,
                    'Content-Type': 'application/json'
                }
            };
            const req = https.request(url, options, function (res) {
                /2[0-9]{2}/.test(res.statusCode) ? resolve(values) : reject(`${res.statusCode} ${res.statusMessage}`);
            });
            req.end();
        }
        else {
            resolve(values);
        }
    });
}

function getExistingValues() {
    return new Promise(function (resolve, reject) {
        const options = {
            headers: {
                'X-Api-Key': token,
                'Content-Type': 'application/json'
            }
        };
        https.get(url, options, function (res) {
            switch (res.statusCode) {
                case 200:
                    res.on('data', function (d) {
                        try {
                            const record = JSON.parse(d.toString());
                            for (let i = 0; i < record.rrset_values.length; ++i) {
                                record.rrset_values[i] = record.rrset_values[i].replace(/"/g, '');
                            }
                            resolve(record.rrset_values);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                    break;
                case 404:
                    resolve([]);
                    break;
                default:
                    reject(`${res.statusCode} ${res.statusMessage}`);
            }
        });
    });
}
