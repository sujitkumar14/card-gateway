# Card Gateway

A module interact with bank and gives back the response to payment gateway.

<h2>Requirements</h2>

    node>=10.16.0 && npm>=6.9.0

<h2>Installation and Usage</h2>

```js
npm install
npm start
```

<h2>API</h2>

    url: http://localhost:3000/v1

<h3>Success Response Structure</h3>

    success: true
    data: {} //object contains the Success Response or empty
    code: 200 

<h3>failed Response Structure</h3>

    success: false
    code: 400-500
    description: //Reason of being failed 


<h2> Endpoints </h2>

<h3>payment</h3>
Payment endpoint interact with Bank and gives back a response on the redirect url.

    Endpoint: /payment

Request

    Method: POST
    Body:
        a. txId
        b. cardNo
        c. cvv
        d. expiry - timestamp 13 digit format
        f. redirectUrl
        g. amount
        h. currencyCode
        i. type - ['credit_card','debit_card']
    Headers:
        a. checksum -  encryted with the private Key using symmetric key
    
Response

    Body:
        a. txId 
        b. bankUrl - received from bank
        c. amount
        d. currency
        e. status 
    Headers:
        a. checksum -  encryted with the private Key using symmetric key

<h3>Txs Details</h3>
Returns the Details of txId

    Endpoint: /:txid

Request:
    
    Method: GET
    Params:
        a. txid - Transaction Id of which details need

Response:

    Body:
        a. txId
        b. status
        c. amount
        d. refundedAmount //total Refunded Amount
        f. redundedTxs // refunded txs
        g. currency

<h3>Refund Payment</h3>
Refund the amount of txId

    Endpoint: /refund

Request:

    Method: POST
    Body:
        a. txId
        b. rid - refundId
        d. amount
    Headers:
        a. checksum - encryted with the private Key using symmetric key
       

Response:
    
    Body:
        a. txId
        b. rid
        c. amount
        d. status

<h3>Redirect Url for Bank</h3>
Url at which banks sends a Response after completion of payment

    Endpoint: /payment/:txid

Request:

    Method: POST
    Params:
        a. txid - transaction Id
    body:
        status


<h3>Redirect Refund Url for Bank</h3>
Url at which banks sends a Response after completion of a payment

    Endpoint: /refund/:rid

Request:

    Method: POST
    Params: 
        a. rid - refund Id
    body: 
        status

