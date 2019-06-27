const Request = require('request-promise');
const Utils = require('../../app/utils/utils');
const Config = require('../../app/config');

let url = "http://localhost:3000/v1";

let txId = '4';
let options = {

    'url': url + `/payment/${txId}`,
    'method': 'GET',
    'qs': {},
    'headers': {},
    'json': true
}
options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['qs']), Config['secretKey']);
// console.log(options['headers']['checksum']);

Request(options)
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });