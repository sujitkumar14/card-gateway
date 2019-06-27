
# DB Structure

## Card Schema

    a. cardNo
    b. cvv
    c. expiry 
    d. createdAt 
    e. updatedAt

- **cardNo** Card Number , String, Unique value
- **cvv** String
- **expiry** Number, 10 Digit Timestamp
- **createdAt** Number, 13 Digit Timestamp
- **updatedAt** Number, 13 Digit Timestamp

## Currency Schema

    a. name
    b. code 
    c. decimals 
    d. country 
    e. createdAt 
    f. updatedAt 

- **name** String, ex. "Indian Rupee"
- **code** String, Unique, ex."INR"
- **decimals** Number
- **country** String
- **createdAt** Number, 13 digit Timestamp
- **updatedAt** Number, 13 digit Timestamp

## Transaction Schema

    a. txId 
    b. type 
    c. status 
    d. currencyCode
    e. redirectUrl
    f. createdAt
    g. updatedAt
    h. amount
    i. refundedAmount
    j. typeId

- **txId**  Transaction Id, String, Unique, Recieved From Payment Gateway
- **type**  String , enum ["debit_card","credit_card"]
- **status**  String , enum ["pending","completed","failed"]
- **currencyCode** String , foreign key of currency collection, "INR"
- **redirectUrl** String
- **amount** String, amount of this txs
- **refundedAmount** String, refunded Amount for this txs
- **typeId** String, foreign key, ex. cardNo in case if Debit or Credit Card, AccountNo in case of Netbanking

## Refund Tx Schema

    a. rid - String //refundId
    b. txId - String //refunded for txIds
    c. amount - String // refunded amount
    d. status - String [pending, completed]
    e. createdAt - Number - 13 digit
    f. updatedAt - Number - 13 digit

- **rid** Refund Id, unique , Recieved from PG
- **txId** transaction Id, String, foreign Key of transction Schema
- **amount** String
- **status** String , ["pending","completed","failed"]
- **createdAt** Number, 13 Digit Timestamp
- **updatedAt** Number, 13 Digit Timestamp
