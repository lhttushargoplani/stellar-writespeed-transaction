const StellarSdk = require("stellar-sdk"); // version - ^10.4.1
const moment = require("moment");

writeTransaction = async (amount) => {
  try {
    // here we get integer value and convert into string using toString()
    const fee = Math.ceil(amount + 100).toString();
    //use here horizon testnet endpoint
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

    // load source-account public key
    const sourceKeys = StellarSdk.Keypair.fromSecret(
      "SAJZXJHRPJEF33XLB232CQRF7VTVRNBS4QHV5AH6YLOGUHFGIJJGFOR2"
    );

    const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

    //load here destination public key
    const destinationAccount =
      "GDSNFSBH3V2QUQPJ357JXY242IRLN3MW4IZPP5WNT34OPWP445ZSXJNX";

    //transaction details and write speed charge
    let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationAccount,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        })
      )
      .setTimeout(300)
      .build();

    // key pair used to sign transactions
    transaction.sign(sourceKeys);
    const startTime = Date.now();
    //submit the transaction
    transaction = await server.submitTransaction(transaction);

    // differnece of current time and before submittion time
    let value = moment().diff(moment(startTime), "milliseconds");
    console.log("WriteSpeed of transactions for Stellar is ", value);
  } catch (error) {
    console.log({ message: error.message, code: error.code });
  }
};
//call the function
writeTransaction(100);
