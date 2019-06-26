const Request = require('request-promise');
const Chai = require('chai');
const Utils = require('../app/utils/utils');
const Config = require('../app/config');

let url = "http://localhost:3000/v1"




describe("Payment Route", function () {

    it('Check POST Request', function (done) {

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
        // console.log(options['headers']['checksum']);

        Request(options)
            .then((response) => {
                Chai.expect(response.status.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err);
            });
    });

    it('Check Checksum Request', function (done) {

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

        Request(options)
            .then((response) => {
                Chai.expect(response.status.code).to.equal(401);
                done();
            })
            .catch((err) => {
                err = err.error;
                Chai.expect(err.status.code).to.equal(401);
                done();
            });
    });


    it('Check Get Request' , function (done) {

        this.timeout(0);


        let options = {

            'url': url + `/payment/${2}`,
            'method': 'GET',
            'qs':{},
            'headers': {},
            'json': true
        }
        options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['qs']), Config['secretKey']);

        Request(options)
            .then((response) => {
                Chai.expect(response.status.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err);
            });
    });

    it('Check For Invalid Parameter Request' , function (done) {

        this.timeout(0);


        let options = {

            'url': url + '/payment',
            'method': 'POST',
            'body': {

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


        Request(options)
            .then((response) => {
                Chai.expect(response.status.code).to.equal(400);
                done();
            })
            .catch((err) => {
                err = err.error;
                Chai.expect(err.status.code).to.equal(400);
                done();
            });
    });

});



