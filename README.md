# Card Gateway

A module interact with bank and gives back the response to payment gateway.

## Requirements

    node>=10.16.0 && npm>=6.9.0 && mongodb>=4.0 && redis

## Installation and Usage

```js
npm install
npm start
```

## API Docs

    url: http://localhost:3000/v1

## Success Response Structure

    success: true
    data: {} //object contains the Success Response or empty
    code: 200 

### failed Response Structure

    success: false
    code: 400-500
    description: //Reason of being failed 


## Endpoints

### payment

Payment endpoint interact with Bank and gives back a response on the redirect url.

    Endpoint: /payment

#### Request

    Method: POST
    Body:
        a. txId
        b. cardNo
        c. cvv
        d. expiry 
        f. redirectUrl
        g. amount
        h. currencyCode
        i. type 
        j. saveCard 
    Headers:
        a. checksum -  encryted with the private Key using symmetric key

- **txId:** Transaction Id
- **cardNo:** CardNo
- **cvv:** card CVV Number(Optional If card is saved)
- **expiry:** Card Expiry (Optional If card is saved), 13 Digit Timestamp
- **redirectUrl:** Url at which redirection happen after the completion of payment
- **CurrencyCode:** Currency Code in which payment being made [INR, YEN]
- **type:** Type of Payment [credit_card, debit_card]
- **saveCard:** Want to save card for future [true, false]
- **checksum:** Checksum created using Private Key

#### Response

    Body:
        a. txId 
        b. bankUrl - received from bank
        c. amount
        d. currencyCode
        e. status 
    Headers:
        a. checksum -  Body is signed with the private Key

- **bankUrl:** The Url received from Bank

### Txs Details

Returns the Details of txId

    Endpoint: /:txid

#### Request

    Method: GET
    Params:
        a. txid - Transaction Id of which details need
    Headers:
        a. checksum - Query Params in signed with the private key

#### Response

    Body:
        a. txId
        b. status
        c. amount
        d. refundedAmount //total Refunded Amount
        e. redirectUrl
        f. redundedTxs // refunded txs array
        g. currencyCode
        h. type
        i. cardNo or AccountNo
        j. createdAt
        k. updatedAt

- **refundedAmount:** Total Refunded Amount for the Transaction
- **refundedTxs** Array of all refunded Txs

### Refund Payment

Refund the amount of txId

    Endpoint: /refund

#### Request

    Method: POST
    Body:
        a. txId
        b. rid - refundId
        d. amount
    Headers:
        a. checksum - Signed with the private Key

- **rid:** Refuned Id

#### Response

    Body:
        a. txId
        b. rid
        c. amount
        d. status

### Redirect Url for Bank

Url at which banks sends a Response after completion of payment

    Endpoint: /payment/:txid

#### Request

    Method: POST
    Params:
        a. txid - transaction Id
    body:
        status


### Redirect Refund Url for Bank

Url at which banks sends a Response after completion of a payment

    Endpoint: /refund/:rid

#### Request

    Method: POST
    Params: 
        a. rid - refund Id
    body: 
        status

### Add new Currency Support

Add a new currency

    Endpoint: /currency/new

#### Request

    Method: POST
    Body:
        a. name
        b. code
        c. decimals
        e. country

- **name** Currency Name ex Indian Rupee
- **Code** Currency Code ex INR
- **Decimals** Number of Decimals supported by the this Coin ex. INR,2

### Save new Card

    Endpoint: /card/new

#### Request

    Method: POST
    Body:
        a. cardNo
        b. expiry
        c. cvv
