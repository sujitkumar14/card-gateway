const Request = require('request-promise');
const Chai = require('chai');
const Utils = require('../app/utils/utils');
const Config = require('../app/config');

let url = "http://localhost:3000/v1"




describe("Payment Route", function () {

    it('/payment', function (done) {

        this.timeout(0);


        let options = {

            'url': url + '/payment',
            'method': 'POST',
            'body': {

                'txId': '2',
                'currencyCode': 'INR',
                'amount': '23',
                'type': 'debit_card',
                'redirectUrl': "http://localhost:4000/payment/2",
                'expiry': 1564120270259,
                'cvv': 123,
                'cardNo': 1234657899876453
            },
            'headers': {},
            'json': true
        }
        options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['body']), Config['secretKey']);
        console.log(options['headers']['checksum']);

        Request(options)
            .then((response) => {
                Chai.expect(response.status.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err);
            });
    });


    it('/payment', function (done) {

        this.timeout(0);


        let options = {

            'url': url + `/payment/${2}`,
            'method': 'GET',
            'headers': {},
            'json': true
        }
        // options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['body']), Config['secretKey']);

        Request(options)
            .then((response) => {
                Chai.expect(response.status.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err);
            });
    });
});



