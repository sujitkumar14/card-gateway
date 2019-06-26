
# DB Structure


<h2> Card Schema </h2>

    a. cardNo - String - unique
    b. cvv - Number
    c. expiry - String //Timestamp
    d. createdAt - Timestamp  - 13 digit
    e. updatedAt - Timestamp - 13 digit

<h2> Currency Schema </h2>

    a. name - String 
    b. code - String - ex -> [INR, YEN] - Unique
    c. decimals - Number - Number of Decimal places    
    d. country - String - coin of which country
    e. createdAt - Number - 13 digit
    f. updatedAt - Number - 13 digit

<h2> Transaction Schema</h2>

    a. txId - String // received from Payment Gateway
    b. type - ["debitcard","creditcard"]
    c. status - String //tx Status - {pending, completed} 
    d. currencyCode - String // currency code of payment
    e. redirectUrl - string //redirect Url of PG for Success and Failure of tx
    f. createdAt - Number //Timestamp at which this document is created - 13 digit
    g. updatedAt- Number //Timestamp at which this document is updated  - 13 digit
    h. amount - String //amount 
    i. refundedAmount - String //refunded amount
    j. typeId - String //in case of debitcard and creditcard - cardNo


<h2> Refund Tx Schema </h2>

    a. rid - String //refundId
    b. txId - String //refunded for txIds
    c. amount - String // refunded amount
    d. status - String [pending, completed]
    e. createdAt - Number - 13 digit
    f. updatedAt - Number - 13 digit
