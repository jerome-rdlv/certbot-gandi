#!/usr/bin/env node

'use strict';

const https = require('https');
const token = process.env.GANDI_API_TOKEN;

if (!token) {
    console.error('You must set GANDI_API_TOKEN environment variable.');
    process.exit(1);
}

const url = `https://id.gandi.net/tokeninfo`;

const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
};

const request = https.request(url, options, res => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    res.on('data', d => {
        console.log('body:', JSON.parse(d));
    });
});
request.on('error', e => console.error(e));
request.end();


