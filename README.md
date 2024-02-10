# SwiftPay - P2P Payment Gateway

SwiftPay is a peer-to-peer payment gateway forked from the SwiftCash web wallet, written in html, css and javascript. All signatures are handled on the client-side and private keys never leave the browser. To secure the account of users who login with an email and password rather than a private key, the wallet hashes the email and passsword 144,000 times, and then uses the final hash to create an address and private key in the end. The wallet also enforces very strong passwords using a password strength meter to further secure the accounts against brute-force attacks.

After redirecting the user to this gateway hosted on https://pay.swiftcash.cc, with the provided paramters in the URL, the user will be asked to login with either their email and password or with a private key of the specific coin they have to pay in. The email and password login will land the user on their SwiftCash web wallet account. The coin to be used will be selected and cannot be changed and the merchant address, as well as the amount to be paid, will also be prefilled and cannot be changed. The user will then need to confirm the payment by clicking on "Send". If the transaction is broadcasted successfully, the user will then be redirected back to the return URL with all the parameters sent, as well as the txid. The merchant can then verify the transaction, by looking the transaction details up on a coin explorer or via a full node.

# Hosting
This app is hosted on github, and can be verified and accessed via the following links:

* https://swiftcashproject.github.io/swiftpay/
* https://pay.swiftcash.cc/

To avoid becoming a victim of phishing attacks, make sure you always double check the domain in your browser's address bar. You can also download the wallet and run it locally. But you're still going to need Internet in order to transact with the blockchain.

# BTC, LTC, DOGE and DASH Support
Bitcoin, Litecoin, Dogecoin and Dash transactions are created and signed locally and then sent to their own networks using api(s) provided by https://blockchair.com/ and https://www.blockcypher.com.

# Login With Your Private Key(s)
You can login with a SwiftCash, Bitcoin, Litecoin, Dogecoin or Dash private key. If you login with a SwiftCash private key, the wallet will generate a Bitcoin, Litecoin and Dogecoin address using your SwiftCash private key. If you login with a Bitcoin private key, the wallet will generate a SwiftCash, Litecoin, Dogecoin and Dash address using your Bitcoin private key. And so will be the case if you login with a Litecoin, Dogecoin or Dash private key. It is however highly recommended to use email and password to login if you intend to stash all your cryptos in the same wallet per se, and only use the login with private key feature to spend your paper or brain wallets.

# Transaction Fees
The wallet enforces a minimum of `0.101 SWIFT`, `0.0002 BTC`, `0.002 LTC`, `2 DOGE` and `0.002 DASH` transaction fees and allows users to increase this fee. To help avoid situations in which ridiculously high fees are paid by accident, the wallet enforces a maximum of `1 SWIFT`, `0.02 BTC`, `0.2 LTC`, `200 DOGE` and `0.2 DASH` transaction fees.

# Change Addresses
By default, all changes are sent back to the sender's address. To specify a custom change address, click on the vial icon. You need to specify a custom change address everytime you login or switch between different coins, to override the default behavior.

# Notes
* To copy your address, click on the copy icon next to your address.
* To refresh your balance, click on the bolt icon next to your balance.
* To view your balance in US dollars, click on your balance.
* To specify a custom change address, click on the vial icon.
* To change/adjust the transaction fee, click on the wrench icon.
* To copy your private key, click on the key icon.
* To add a donation, click on the gift icon.
* To release your HODL deposit, click on the unlock icon.

# Merchants
To request a payment from your client, redirect them to https://pay.swiftcash.cc with the following "GET" parameters:

* `mAddress`: The merchant's BTC, LTC, DOGE, DASH or SWIFT address.
* `coin`: The coin to be paid with. It can be BTC, LTC, DOGE, DASH or SWIFT.
* `amount`: The amount of coins or fiat to be paid in.
* `currency`: The fiat currency if amount is in fiat such as USD, EUR.
* `deduct`: In percentage, to accept cryptos below market price.
* `memo`: A memorandum to attach to the transaction such as the order id.
* `retURL`: The return URL to return the client back to merchant.

# Examples

The following URL, will redirect the user to pay.swiftcash.cc where the user is asked to login to their wallet. Then the user will be required to pay `1000 USD`, `1%` below market price in SWIFT to the appropriate address with memo being `3004125`. The memo field helps merchants to store certain information in a transaction for followup validations on their end and this way, they will only need to have one address for each coin, rather than many addresses. Once the client confirms the transaction, they will be redirected to https://hive.blog/@swiftcash in this example with all the URI parameters added to the `retURL` plus the `txid` of the transaction. The merchant can then verify the transaction by pulling it from either their own full node or from a public explorer and then validating the value, memo, etc against their own database. The memo field could most likely be the order id so the merchant can pull the order details on their end and verify that the broadcasted transaction from the client is a valid one.

https://pay.swiftcash.cc?mAddress=SXucSXaV5HURNyJUWnPrVFHTdRzoVff6gU&coin=SWIFT&amount=1000&currency=USD&deduct=1&memo=3004125&retURL=https://hive.blog/@swiftcash

In this example, everything is just like above however, the requested money is in Bitcoin without any `currency` or `deduct` fields which means the user will be required to pay exactly `0.1 BTC` and there won't be any conversion to fiat.

https://pay.swiftcash.cc?mAddress=SXucSXaV5HURNyJUWnPrVFHTdRzoVff6gU&coin=BTC&amount=0.1&memo=3004125&retURL=https://hive.blog/@swiftcash

Everything is completely open-source, decentralized and peer-to-peer with 0% fees taken for third parties, unlike things like coinpayments. Nothing runs on any server(s) and the merchant can verify the transactions via running full nodes or by using public coin explorers. The data field will be stored in the transaction in an OP_RETURN output. It will be the last output and can be easily accessed and decoded by the merchant. In case of SwiftCash (SWIFT) transactions, the decoded data is visible under the "Scripts" tab of transactions.

# License
Copyright (C) 2018-2024 SwiftCash Developers <br />
This software is provided as is and with no warranty under the MIT license.

# Donation Addresses
* SWIFT: `SXucSXaV5HURNyJUWnPrVFHTdRzoVff6gU`
* BTC: `1E9xPAPifPFHmVTX1pDdPLcsgub71zdpDY`
* LTC: `LYNueNhYk3VM2J9gBxCvfMgdu7xP9WdLVL`
* DOGE: `DJJ3vRLMxo9aJVe7kQDBw6nUa3KQL8zzfv`
* DASH: `XoqoDR3cd6TsvS46shXrEsJfXFAo5TsSk1`

# Support
For support, join http://discord.swiftcash.cc

# Whitepaper
To find out more about SwiftCash, consider reading our whitepaper!
https://swiftcash.cc/assets/whitepaper.pdf
