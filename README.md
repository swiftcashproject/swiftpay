# SwiftPay - P2P Payment Gateway

SwiftPay is a peer-to-peer payment gateway forked from the SwiftCash web wallet, written in html, css and javascript. All signatures are handled on the client-side and private keys never leave the browser. To secure the account of users who login with an email and password rather than a private key, the wallet hashes the email and passsword 144,000 times, and then uses the final hash to create an address and private key in the end. The wallet also enforces very strong passwords using a password strength meter to further secure the accounts against brute-force attacks.
\
\
After redirecting the user to this gateway hosted on https://pay.swiftcash.cc, with the provided paramters in the URL, the user will be asked to login with either their email and password or with a private key of the specific coin they have to pay in. The email and password login will land the user on their SwiftCash web wallet account. The coin to be used will be selected and cannot be changed and the merchant address, as well as the amount to be paid, will also be prefilled and cannot be changed. The user will then need to confirm the payment by clicking on "Send". If the transaction is broadcasted successfully, the user will then be redirected back to the return URL with all the parameters sent, as well as the txid. The merchant can then verify the transaction, by looking the transaction details up on a coin explorer or via a full node.

# Hosting
This web wallet is hosted on github, and can be verified and accessed via the following links:

* https://swiftcashproject.github.io/swiftpay/
* https://pay.swiftcash.cc/

To avoid becoming a victim of phishing attacks, make sure you always double check the domain in your browser's address bar. You can also download the wallet and run it locally. But you're still going to need Internet in order to transact with the blockchain.

# BTC, LTC and DOGE Support
Bitcoin, Litecoin and Dogecoin transactions are created and signed locally and then sent to their own networks using api(s) provided by https://chain.so/ - https://www.blockcypher.com is also used for following up on transaction details.

# Login With Your Private Key(s)
You can login with a SwiftCash, Bitcoin, Litecoin or Dogecoin private key. If you login with a SwiftCash private key, the wallet will generate a Bitcoin, Litecoin and Dogecoin address using your SwiftCash private key. If you login with a Bitcoin private key, the wallet will generate a SwiftCash, Litecoin and Dogecoin address using your Bitcoin private key. And so will be the case if you login with a Litecoin or Dogecoin private key. It is however highly recommended to use email and password to login if you intend to stash all your cryptos in the same wallet per se, and only use the login with private key feature to spend your paper or brain wallets.

# Transaction Fees
The wallet enforces a minimum of `0.002 SWIFT`, `0.0001 BTC`, `0.001 LTC` and `1 DOGE` transaction fees and allows users to increase this fee. To help avoid situations in which ridiculously high fees are paid by accident, the wallet enforces a maximum of `0.2 SWIFT`, `0.01 BTC`, `0.1 LTC` and `100 DOGE` transaction fees.

# Change Addresses
By default, all changes are sent back to the sender's address. To specify a custom change address, click on the vial icon. You need to specify a custom change address everytime you login or switch between different coins, to override the default behavior.

# Notes
* To copy your address, click on the copy icon next to your address.
* To refresh your balance, click on the lightning icon next to your balance.
* To view your balance in US dollars, click on your balance.
* To specify a custom change address, click on the vial icon.
* To change/adjust the transaction fee, click on the wrench icon.
* To copy your private key, click on the key icon.
* To donate, click on the donate icon.

# Merchants
To request a payment from your client, redirect them to https://pay.swiftcash.cc with the following "GET" parameters:

* `mAddress`: The merchant's BTC, LTC, DOGE or SWIFT address.
* `coin`: The coin to be paid with. It can be BTC, LTC, DOGE or SWIFT.
* `amount`: The amount of coins or fiat to be paid in.
* `currency`: The fiat currency if amount is in fiat. It can be USD, EUR, etc.
* `deduct`: The percentage to be deducted in fiat conversions to accept coins below market price.
* `data`: The data the merchant wants to associate with the transaction such as the order id.
* `retURL`: The return URL in case the merchant wants to return the client to their website.

Everything is completely open-source, decentralized and peer-to-peer with 0% fees taken for third parties, unlike things like coinpayments. Nothing runs on any server(s) and the merchant can verify the transactions via running full nodes or by using public coin explorers. The data field will be stored in the transaction in an OP_RETURN output. It will be the last output and can be easily accessed and decoded by the merchant. In case of SwiftCash (SWIFT) transactions, the decoded data is visible under the "Scripts" tab of transactions.

# License
Copyright (C) 2018-2019 SwiftCash Developers <br />
This software is provided as is and with no warranty under the MIT license.

# Donation Addresses
* SWIFT: `SXucSXaV5HURNyJUWnPrVFHTdRzoU2u19F`
* BTC: `1BccQgoLLvHDrfX1yMQmwM8tyemNe84ZjJ`
* LTC: `LVqZfu7ARaXH7UDB9VQ5DNCfBs8eqfRRNx`
* DOGE: `DFkhwwjyeLBWPfhchwQLV7JVrnVg45zgh6`

# Support
For support, join http://discord.swiftcash.cc

# Whitepaper
To find out more about SwiftCash, consider reading our whitepaper!
https://swiftcash.cc/assets/whitepaper.pdf
