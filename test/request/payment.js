const Request = require('request-promise');
const Utils = require('../../app/utils/utils');
const Config = require('../../app/config');

let url = "http://localhost:3000/v1";

let txId = '4';
let options = {

    'url': url + '/payment',
    'method': 'POST',
    'body': {

        'txId': txId,
        'currencyCode': 'INR',
        'amount': '20',
        'type': 'debit_card',
        'redirectUrl': `http://localhost:4000/payment/${txId}`,
        'expiry': 1564120270259,
        'cvv': "123",
        'cardNo': 1234657899876453
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