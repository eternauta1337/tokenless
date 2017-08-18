# Tokenless Prediction Market
A tokenless prediction prediction based on OpenZeppelin/tokenless that uses 
truffle-box with React + Redux + Truffle+ Router (etc).

## Development

Download sources:
```git clone git@github.com:ajsantander/tokenless.git```

Install packages:
```npm install```

Start UI server:
```npm start```

Run custom testrpc:
```npm run rpc```

Configure [constants.js](https://github.com/ajsantander/tokenless/blob/master/src/constants.js) to use testrpc
DEBUG_MODE
USE_INJECTED_WEB3
TARGET_LIVE_NETWORK
etc...

## Live Testnet Version
[https://tokenless-32142.firebaseapp.com/](https://tokenless-32142.firebaseapp.com/)

## OpenZeppelin Security
Built using the OpenZeppelin solidity contracts conforming to best practices and standards.
[zeppelin-solidity](https://github.com/OpenZeppelin/zeppelin-solidity)

## Built on top of truffle-box

This project is built on top trufle-box/react-auth-box, which uses create-react-app
with React, Redux and Router.

See [truffle-box](https://github.com/truffle-box/react-auth-box) for details on project
bootstrap and configuration.