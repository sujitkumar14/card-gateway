const Request = require('request-promise');
const Chai = require('chai');
const Utils = require('../app/utils/utils');
const Config = require('../app/config');

let url = "http://localhost:3000/v1"


describe("Currency Route", function () {

    it('Add New Currency', function (done) {

        this.timeout(0);

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
                Chai.expect(response.status.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err);
            });
    });

    it('Check Invalid Parameter Request', function (done) {

        this.timeout(0);

        let options = {

            'url': url + '/currency/new',
            'method': 'POST',
            'body': {

                
                'code': 'INR',
                'country': 'India',
                'decimals': 2
            },
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
                err = err.error;
                Chai.expect(err.status.code).to.equal(400);
                done();
            });
    });
});



