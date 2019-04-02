#!/usr/bin/env node

'use strict';

const https = require('https');
const token = process.env.GANDI_API_TOKEN;

if (!token) {
    console.error('You must set GANDI_API_TOKEN environment variable.');
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
        'X-Api-Key': token,
        'Content-Type': 'application/json'
    }
};
https.request(url, options).end();
