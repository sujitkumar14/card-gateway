const Request = require('request-promise');
const Chai = require('chai');
const Utils = require('../../app/utils/utils');
const Config = require('../../app/config');

let url = "http://localhost:3000/v1"


describe("Card Route", function () {

    it('Add New Card', function (done) {

        this.timeout(0);

        let options = {

            'url': url + '/card/new',
            'method': 'POST',
            'body': {

               'cardNo': '1234489734634834',
               'expiry': 1543212343323,
               'cvv': '123'
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

    it('Check Invalid Parameter Request', function (done) {

        this.timeout(0);

        let options = {

            'url': url + '/card/new',
            'method': 'POST',
            'body': {

            
               'expiry': 1543212343323,
               'cvv': '123'
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
                err = err.error;
                Chai.expect(err.status.code).to.equal(400);
                done();
            });
    });

    it('Check Checksum Request', function (done) {

        this.timeout(0);

        let options = {

            'url': url + '/card/new',
            'method': 'POST',
            'body': {

               'cardNo': '1234489734634834',
               'expiry': 1543212343323,
               'cvv': '123'
            },
            'headers': {},
            'json': true
        }
        // options['headers']['checksum'] = Utils.createHMAC256(JSON.stringify(options['body']), Config['secretKey']);

        Request(options)
            .then((response) => {
                // Chai.expect(response.status.code).to.equal(200);
                // done();
            })
            .catch((err) => {
                err = err.error;
                Chai.expect(err.status.code).to.equal(401);
                done();
            });
    });


});



