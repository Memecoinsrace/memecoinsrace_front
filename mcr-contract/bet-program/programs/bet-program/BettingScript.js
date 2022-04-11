// Parse arguments
// --program - [Required] The account address for your deployed program.
// --feed - The account address for the Chainlink data feed to retrieve
const anchor = require("@project-serum/anchor"); // создает подключение к Solana

//PublicKey for token programm of SOLANA
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"; // адрес аккаунта отвечающего за смарт
const solanaWeb3 = require("@solana/web3.js"); // web3
const { PublicKey } = require("@solana/web3.js"); // web3 переменная

const args = require("minimist")(process.argv.slice(2)); // адрес смарта и адрес монеты (аргументы)

// Initialize Anchor and provider
const provider = anchor.Provider.env(); // инициализация Anchor
// Configure the cluster.
anchor.setProvider(provider); // инициализация

//PublicKey for chainlink programm
const CHAINLINK_PROGRAM_ID = "CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT"; // адрес смарта Chainlink
const DIVISOR = 100000000; // чтобы в десятичном виде отображать цену

// Data feed account address
// Default is SOL / USD
const default_feed = "EdWr4ww1Dq82vPe8GFjjcVPo2Qno3Nhn6baCgM3dCy28"; // адрес монеты Solana
const CHAINLINK_FEED = args["feed"] || default_feed; // если есть аргумент, ставит его, если нет - то Solana

async function main() {
  // Read the generated IDL.
  const idl = JSON.parse(
    require("fs").readFileSync("./target/idl/anchor_bet.json", "utf8")
  ); // десереалищзация ответов от смарта

  // Address of the deployed program.
  const programId = new anchor.web3.PublicKey(args["program"]); // адрес смарта по дефолту

  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId); // взаимодействие смарта и json файлика

  //Minted tokens:  EwJr2ibR39HTBPJqKEP9etqcMmJ9hb7djLxe28vwM6oF
  //Token account with the minted tokens for bet
  USER_DEPOSIT_TOKEN_ACCOUNT = "FaVQBqKVUaSBsNWuGAz2goL3x59mrVtoSaFhjDwAeTFK"; // аккаунт пользователя (с нашими токенами)
  const depositPubkey = new PublicKey(USER_DEPOSIT_TOKEN_ACCOUNT); // переменная PublicKey с адресом аккаунта пользователя

  //create an account to store the price and bett data
  const escrowAccount = anchor.web3.Keypair.generate(); // аккаунт хранящий все данные ставки (сколько поставили, на что поставили, кто поставил и т.д.)

  TREASURY_ACCOUNT_PDA = "2Q5FCcUhvBVgJv6dCwNRdgAvEtxZVPUwxmxTKY9GHfZc"; // аккаунт на котором хранятся токены, куда переводятся все ставки
  const treasuryPubkey = new PublicKey(TREASURY_ACCOUNT_PDA); // переменная  PublicKey с адресом аккаунта казны

  TREASURY_AUTHORITY_PDA = "8NdpuYnWHxYYCifxxe9cXidrTb6VPfJmm9txLYirqQBY"; // ключ с помощью которого можно подписать переведы с казны

  console.log(
    "Generated escrow account public key: " + escrowAccount.publicKey
  );
  //User  accounts
  console.log("User main public key (SOL): " + provider.wallet.publicKey);

  console.log(
    "User token public key (bet deposit): " + USER_DEPOSIT_TOKEN_ACCOUNT
  );

  //Show balances before bet
  let userDepositTokenBalance =
    await provider.connection.getTokenAccountBalance(depositPubkey); // проверка аккаунта на наличие токенов
  console.log(
    "USER_DEPOSIT_TOKEN_ACCOUNT balance : ",
    userDepositTokenBalance.value.uiAmountString
  );

  console.log(
    "Treasure account  (smart contract deposit): " + TREASURY_ACCOUNT_PDA
  );

  let treasuryBalance = await provider.connection.getTokenAccountBalance(
    treasuryPubkey
  );
  console.log(
    "TREASURY_ACCOUNT_PDA balance : ",
    treasuryBalance.value.uiAmountString
  );

  //Transaction to start bet
  const tx = program.transaction.execute(
    new anchor.BN(100), //величина ставки
    new anchor.BN(2), //на что ставит 0/1/2 rise/equal/decrease, где 0 - вырастет, 1 - не изменится, 2 - упадет
    {
      accounts: {
        escrowAccount: escrowAccount.publicKey, //generated escrow
        user: provider.wallet.publicKey, //better main account => адрес пользователя
        treasuryAccount: TREASURY_ACCOUNT_PDA, //escrow treasury куда
        userDepositTokenAccount: USER_DEPOSIT_TOKEN_ACCOUNT, //user account with tokens откуда
        chainlinkFeed: CHAINLINK_FEED, //CoinName монета
        chainlinkProgram: CHAINLINK_PROGRAM_ID, //Chainlink program аккаунт смарта на цену
        systemProgram: anchor.web3.SystemProgram.programId, //System program аккаунт солановской библиотеки
        tokenProgram: TOKEN_PROGRAM_ID, // внешний смарт
      },
      instructions: [
        await program.account.escrowAccount.createInstruction(escrowAccount), // дефолтная функция
      ],
      options: { commitment: "confirmed" }, // дефолт
      signers: [escrowAccount, provider.wallet],
    }
  );
  //Signing created transaction with cmd wallet
  tx.feePayer = await provider.wallet.publicKey;
  tx.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  tx.sign(escrowAccount); // подписываем
  const signedTx = await provider.wallet.signTransaction(tx); // подписываем
  const txId = await provider.connection.sendRawTransaction(
    signedTx.serialize()
  ); // отправляем в блокчейн
  await provider.connection.confirmTransaction(txId); // подтверждение от валидаторов

  console.log("Fetching transaction logs...");
  let t = await provider.connection.getConfirmedTransaction(txId, "confirmed"); // логи смарта
  console.log(t.meta.logMessages);
  // #endregion main

  // Fetch the account details of the account containing the price and bet data
  const _escrowAccount = await program.account.escrowAccount.fetch(
    escrowAccount.publicKey
  ); // проверка данных ставки в блокчейне
  console.log("Price for choosen coin is: " + _escrowAccount.value / DIVISOR);
  console.log("Bet amount Is: " + _escrowAccount.betAmount); // значение ставки
  console.log("Bet on result Is: " + _escrowAccount.betOnResult); // на что поставил
  console.log("Pair name: " + _escrowAccount.pairName); // имя монеты
  console.log("Better account : " + _escrowAccount.betterAccount); // аккаунт юзера

  userDepositTokenBalance = await provider.connection.getTokenAccountBalance(
    depositPubkey
  );
  console.log(
    "USER_DEPOSIT_TOKEN_ACCOUNT balance : ",
    userDepositTokenBalance.value.uiAmountString
  );

  treasuryBalance = await provider.connection.getTokenAccountBalance(
    treasuryPubkey
  );
  console.log(
    "TREASURY_ACCOUNT_PDA balance : ",
    treasuryBalance.value.uiAmountString
  );

  //Take a time for a bet check
  pause = 15;
  console.log("waiting for " + pause + " sec...");
  await new Promise((resolve) => setTimeout(resolve, pause * 1000));

  //Create bet checking transaction
  let tx2 = await program.rpc.checkBet({
    accounts: {
      escrowAccount: escrowAccount.publicKey, //generated escrow with props
      chainlinkFeed: CHAINLINK_FEED, //CoinName
      chainlinkProgram: CHAINLINK_PROGRAM_ID, //Chainlink program
      treasuryAccount: TREASURY_ACCOUNT_PDA, //escrow treasury
      treasuryAuthority: TREASURY_AUTHORITY_PDA, //escrow treasury authority
      userDepositTokenAccount: USER_DEPOSIT_TOKEN_ACCOUNT, //betToken user account
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    options: { commitment: "confirmed" },
    signers: [escrowAccount],
  });

  console.log("Fetching transaction logs...");
  let t2 = await provider.connection.getConfirmedTransaction(tx2, "confirmed");
  console.log(t2.meta.logMessages);

  // Fetch the account details of the account containing the price and bet data
  const _escrowAccountCheck = await program.account.escrowAccount.fetch(
    escrowAccount.publicKey
  );
  console.log("Price Is: " + _escrowAccountCheck.value / DIVISOR);
  console.log(
    "Bet amount after closing escrow: " + _escrowAccountCheck.betAmount
  );
  console.log("Bet on result is: " + _escrowAccountCheck.betOnResult);
  console.log("Coin pair name: " + _escrowAccountCheck.pairName);
  console.log("Better account : " + _escrowAccountCheck.betterAccount);
  if (_escrowAccountCheck.userWins) {
    console.log("User WINS a bet");
  } else {
    console.log("User LOOSE a bet");
  }

  userDepositTokenBalance = await provider.connection.getTokenAccountBalance(
    depositPubkey
  );
  console.log(
    "USER_DEPOSIT_TOKEN_ACCOUNT balance : ",
    userDepositTokenBalance.value.uiAmountString
  );

  treasuryBalance = await provider.connection.getTokenAccountBalance(
    treasuryPubkey
  );
  console.log(
    "TREASURY_ACCOUNT_PDA balance : ",
    treasuryBalance.value.uiAmountString
  );

  console.log("Bet is closed");
}

console.log("Running client...");
main().then(() => console.log("Success"));
