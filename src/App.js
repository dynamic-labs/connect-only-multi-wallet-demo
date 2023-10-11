import { useState } from "react";
import { EthersWalletConnectExtension } from "@dynamic-labs/ethers-v5";
import {
  DynamicContextProvider,
  useDynamicContext,
} from "@dynamic-labs/sdk-react";

function Page() {
  const {
    setShowAuthFlow,
    setPrimaryWallet,
    primaryWallet,
    secondaryWallets,
    handleUnlinkWallet,
  } = useDynamicContext();

  const [signature, setSignature] = useState('')

  async function signMessage() {
    if (!primaryWallet) {
      return;
    }

    const signer = await primaryWallet.connector.getEthersSigner();
    const signature = await signer.signMessage("hello world");
    setSignature(signature)
  }

  return (
    <div>
      <button onClick={() => setShowAuthFlow(true)}>Connect wallet</button>
      <div>
        Primary wallet:
        {primaryWallet && (
          <>
            <div>
              <span>address: {primaryWallet.address} | </span>
              <span>name: {primaryWallet.connector.name}</span>
            </div>
            <div>
              <button onClick={signMessage}>sign message</button>
              {signature && <div>signature: {signature}</div>}
            </div>
          </>
        )}
      </div>
      <div>
        Secondary wallets:
        {secondaryWallets.map((wallet) => (
          <div key={wallet.address}>
            <span>address: {wallet.address} | </span>
            <span>name: {wallet.connector.name} | </span>
            <button onClick={() => setPrimaryWallet(wallet.id)}>
              set primary
            </button>
            <button onClick={() => handleUnlinkWallet(wallet.id)}>
              disconnect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WrappedPage() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "373a7e50-1a9f-46dc-afd3-3777221bddb3",
        initialAuthenticationMode: "connect-only",
        eventsCallbacks: {
          onConnectSuccess: (wallet) => {
            console.log("onConnectSuccess", wallet);
          },
        },
        walletConnectorExtensions: [EthersWalletConnectExtension]
      }}
    >
      <Page />
    </DynamicContextProvider>
  );
}
