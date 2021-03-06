import Web3 from "web3";
import { web3Modal } from "./Web3Modal";
import { fetchContract } from "./Contract.handler";

let web3;
let provider;
let selectedWallet;

export async function connect() {
  if (!window.ethereum) return console.error("No metamask extension detected!");
  try {
    provider = await web3Modal.connect();
    provider.on("accountsChanged", async () => {
      return fetchWallet();
    });

    provider.on("chainChanged", async (chainId) => {
      // if (chainId !== "0x1") alert("Network must be on the mainnet to mint.");
      window.location.reload();
      return fetchWallet();
    });
  } catch (e) {
    console.error(e);
    return;
  }
  return fetchWallet();
}

export async function disconnect() {
  if (provider.close) {
    await provider.close();
    web3Modal.clearCachedProvider();
    provider = null;
  }

  web3Modal.clearCachedProvider();
  provider = null;
  selectedWallet = null;
  return true;
}

export async function fetchWallet() {
  if (provider === null) return;
  web3 = new Web3(provider);

  const wallets = await web3.eth.getAccounts();

  selectedWallet = wallets[0];

  // const balance = await web3.eth.getBalance(selectedWallet);
  // const ethBalance = parseFloat(web3.utils.fromWei(balance, "ether")).toFixed(4);
  return true;
}

export async function mintEvent() {
  if (provider === null || provider === undefined || provider === "") return false;

  const contractData = await fetchContract();
  const contract = new web3.eth.Contract(
    contractData.abi,
    contractData.address
  );
  
  let costToMint;

  const numOfMints = document.querySelector(".num-mints").selectedIndex + 1;
  if (await checkFreeSupply(numOfMints)) {
    costToMint = 0;
  } else {
    const valueInWei = await contract.methods.cost().call();
    costToMint = valueInWei * numOfMints;
  }

  try {
    let tx = await contract.methods.mint(numOfMints).send({
      from: selectedWallet,
      value: costToMint,
    });

    if (tx.status === false) return false;
    else return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function checkFreeSupply(mintAmount) {
  const contractData = await fetchContract();
  const contract = new web3.eth.Contract(
    contractData.abi,
    contractData.address
  );
  const maxFreeSupply = await contract.methods.maxFreeSupply().call();
  const totalSupply = await contract.methods.totalSupply().call();
  return maxFreeSupply > totalSupply + mintAmount;
};

export const fetchWalletInfo = () => {
  return {
    web3: web3,
    provider: provider,
    wallet: selectedWallet,
  };
};
