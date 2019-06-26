const Request = require('request-promise');
const Utils = require('../../app/utils/utils');
const Config = require('../../app/config');

let url = "http://localhost:3000/v1";

let options = {

    'url': url + '/currency/new',
    'method': 'POST',
    'body': {

        'name': 'Indian Rupee',
        'code': 'INR',
        'country': 'India',
        'decimals': 2
    },
    'qs': {},
    'headers': {},
    'json': true
}
options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['body']), Config['secretKey']);

Request(options)
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });