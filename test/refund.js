const Request = require('request-promise');
const Chai = require('chai');
const Utils = require('../app/utils/utils');
const Config = require('../app/config');

let url = "http://localhost:3000/v1"




describe("Refund Route", function () {

    it('/refund', function (done) {

        this.timeout(0);


        let options = {

            'url': url + '/refund',
            'method': 'POST',
            'body': {

                'txId': '2',
                'rId': '25',
                'amount': '2.5654'
            },
            'headers': {},
            'json': true
        }
        options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['body']), Config['secretKey']);

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



