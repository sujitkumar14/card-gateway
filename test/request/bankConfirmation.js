const Request = require('request-promise');
const Utils = require('../../app/utils/utils');
const Config = require('../../app/config');

let url = "http://localhost:3000/v1";

let txId = '1';
let options = {

    'url': url + `/bank/payment/${txId}`,
    'method': 'GET',
    'headers': {},
    'qs':{
        'status': 'completed'
    }, //just for testing
    'json': true
}

Request(options)
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });