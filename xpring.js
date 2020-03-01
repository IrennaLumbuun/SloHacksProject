'use strict'

const RippleAPI = require('ripple-lib').RippleAPI;

/* Credentials of the account placing the order */
const myAddr = 'rfeTWBJ7DajwpKT1w46EWVzEhVVse9EAZE';
const mySecret = 'shgbhCEbPU37YRvAnRAK7sv44E4mr';


const TEST_NET = 'wss://s.altnet.rippletest.net:51233';

const myOrder = {
  'direction': 'buy',
  'quantity': {
    'currency': 'FOO',
    'counterparty': 'TVDY5PVRPdafrc9ipjW5kzpXZfifzScivqXhVLbut9ACSuv',
    'value': '100'
  },
  'totalPrice': {
    'currency': 'XRP',
    'value': '1000'
  }
};

const INTERVAL = 1000;
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
/* Number of ledgers to check for valid transaction before failing */
const ledgerOffset = 5;
const myInstructions = {maxLedgerVersionOffset: ledgerOffset};


/* Verify a transaction is in a validated XRP Ledger version */
function verifyTransaction(hash, options) {
  console.log('Verifying Transaction');
  return api.getTransaction(hash, options).then(data => {
    console.log('Final Result: ', data.outcome.result);
    console.log('Validated in Ledger: ', data.outcome.ledgerVersion);
    console.log('Sequence: ', data.sequence);
    return data.outcome.result === 'SUCCESS';
  }).catch(error => {
    /* If transaction not in latest validated ledger,
       try again until max ledger hit */
    if (error instanceof api.errors.PendingLedgerVersionError) {
      return new Promise((resolve, reject) => {
        setTimeout(() => verifyTransaction(hash, options)
        .then(resolve, reject), INTERVAL);
      });
    }
    return error;
  });
}


/* Function to prepare, sign, and submit a transaction to the XRP Ledger. */
function submitTransaction(lastClosedLedgerVersion, prepared, secret) {
  const signedData = api.sign(prepared.txJSON, secret);
  return api.submit(signedData.signedTransaction).then(data => {
    console.log('Tentative Result: ', data.resultCode);
    console.log('Tentative Message: ', data.resultMessage);
    /* The tentative result should be ignored. Transactions that succeed here can ultimately fail,
       and transactions that fail here can ultimately succeed. */

    /* Begin validation workflow */
    const options = {
      minLedgerVersion: lastClosedLedgerVersion,
      maxLedgerVersion: prepared.instructions.maxLedgerVersion
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => verifyTransaction(signedData.id, options)
    .then(resolve, reject), INTERVAL);
    });
  });
}

async function connectAndSend() {
	api.connect().then(() => {
	  console.log('Connected');
	  return api.prepareOrder(myAddr, myOrder, myInstructions);
	}).then(prepared => {
	  console.log('Order Prepared');
	  return api.getLedger().then(ledger => {
	    console.log('Current Ledger', ledger.ledgerVersion);
	    return submitTransaction(ledger.ledgerVersion, prepared, mySecret);
	  });
	}).then(() => {
	  api.disconnect().then(() => {
	    console.log('api disconnected');
	    process.exit();
	  });
	}).catch(console.error);
}

function createOrder(direction, currency, counterparty, value, xrpValue) {
	return {
	  'direction': direction,
	  'quantity': {
	    'currency': currency,
	    'counterparty': counterparty,
	    'value': value
	  },
	  'totalPrice': {
	    'currency': 'XRP',
	    'value': xrpValue
	  }
	};

}