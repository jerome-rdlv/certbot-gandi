#!/usr/bin/env node

'use strict';

const https = require('https');
const api_key = process.env.GANDI_API_KEY;

if (!api_key) {
    console.error('You must set GANDI_API_KEY environment variable.');
    process.exit(1);
}

const url = process.env.CERTBOT_AUTH_OUTPUT;

if (!url) {
    console.error('This script is to be called by Certbot.');
    process.exit(1);
}

const options = {
    method: 'DELETE',
    headers: {
        'X-Api-Key': api_key,
        'Content-Type': 'application/json'
    }
};
https.request(url, options).end();
