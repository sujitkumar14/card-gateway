const Request = require('request-promise');
const Chai = require('chai');
const Utils = require('../../app/utils/utils');
const Config = require('../../app/config');
const UUID = require('uuid/v4');
let url = "http://localhost:3000/v1"




describe("Check Payment And Refund", function () {

    it('Check Refund Value', function (done) {

        this.timeout(0);
        ////////////////////////// Change parameters based on test   ///////////////////
        let txId = UUID();
        let rId = UUID();
        let amount = Math.floor(Math.random() * 10);
        amount = amount.toString();

        let refund = Math.floor(Math.random() * (amount - 1) + 1);
        refund = refund.toString();
        /////////////////////////////////////////////////////////////////////

        let options = {

            'url': url + '/payment',
            'method': 'POST',
            'body': {

                'txId': txId,
                'currencyCode': 'INR',
                'amount': amount,
                'type': 'debit_card',
                'redirectUrl': `http://localhost:4000/payment/${txId}`,
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

                options = {
                    'url': url + `/bank/payment/${txId}`,
                    'method': 'POST',
                    'body': {

                        'status': 'completed',
                    },
                    'headers': {},
                    'json': true
                }

                return Request(options);

            })
            .then((response) => {

                options = {

                    'url': url + '/refund',
                    'method': 'POST',
                    'body': {

                        'txId': txId,
                        'rId': rId,
                        'amount': refund
                    },
                    'headers': {},
                    'json': true
                }
                options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['body']), Config['secretKey']);

                return Request(options);

            })
            .then( (response)=> {

                options = {

                    'url': url + `/payment/${txId}`,
                    'method': 'GET',
                    'qs': {},
                    'headers': {},
                    'json': true
                }
                options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['qs']), Config['secretKey']);

                return Request(options)
            })
            .then( (response)=>{

                Chai.expect(response.data['refundedAmount']).to.equal(refund);
                done();

            })
            .catch((err) => {
                console.log(err);
            });
    });
});




