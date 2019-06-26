const Request = require('request-promise');
const Utils = require('../../app/utils/utils');
const Config = require('../../app/config');

let url = "http://localhost:3000/v1";

let txId = '1'; //change txId to refund for that txs
let rid  = '3'; //change refund Id 
let options = {

    'url': url + '/refund',
    'method': 'POST',
    'body': {

        'txId': txId,
        'rId': rid,
        'amount': 23

    },
    'headers': {},
    'json': true
}
options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['body']), Config['secretKey']);
// console.log(options['headers']['checksum']);

Request(options)
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });