"use client";

import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { NetworkType } from "@cardano-foundation/cardano-connect-with-wallet-core";
import {
  Assets,
  Emulator,
  fromUnit,
  Lucid,
  UTxO
} from "@lucid-evolution/lucid";
import {aggregateTokens, BuyNFTConfig, hexToString, LockNFTConfig, NFTMinterConfig, parseAssetId, Token, WithdrawNFTConfig} from "./../pages/api/apitypes";
import { useEffect, useState } from "react";


type TransactionType = "Delegate" | "Mint" | "Withdraw" | "Lock" | "Buy"

const tokenInfo = fromUnit("b1d54b4cef31e9bc8705f14c2126878f129ccb4547009707af9365a05279616e437573746f6d");
//nft marketplace with diagnostics
const nftMarketPlace = "5908c5010000323232323232323232323232232323232232322533300d3232533300f300930113754002264a666020601460246ea80184c8cc88c8c8c94ccc058c03cc060dd50010991919299980e8008a9980d00c0b0a99980e98100008a51153301a01816323300100100422533301e00114bd7009919299980e299980e299980e19baf300c301f37540046e980145288a9980ea491b6f75747075742e76616c7565203d3d2076616c203f2046616c73650014a02a666038a66603866ebcc03cc07cdd50010050a51153301d4901256f75747075742e61646472657373203d3d2073656c6c65725f61646472203f2046616c73650014a02a66603866ebcc088c08cc08cc07cdd500119ba548010cc084dd49b94376600c97ae014a22a6603a92012b646174756d5f74616767696e675f68617368286f75747075742c206f75745f72656629203f2046616c73650014a029405280998108011980200200089980200200098110011810000a99980b98088030a5eb7bdb1804c8c8cc0040052f5bded8c044a66603c00226603e66ec1301014000374c00697adef6c60132323232533301e33720910100002133023337609801014000374c00e00a2a66603c66e3d22100002133023337609801014000374c00e00626604666ec0dd48011ba600133006006003375660400066eb8c078008c088008c080004c8cc0040052f5bded8c044a66603a00226603c66ec13001014000375001097adef6c60132323232533301d33720910100002133022337609801014000375001800a2a66603a66e3d22100002133022337609801014000375001800626604466ec0dd48011ba800133006006003375a603e0066eb8c074008c084008c07c004c070c064dd50010a9980ba4811f657870656374205370656e64286f75745f72656629203d20707572706f73650016375860366038603860306ea8c06c008c068c06c004c058dd50039bad300130143754018600860286ea80308c05cc0600044c8cc004004dd6180b980c180c180c180c180c180c180c180c180a1baa30043014375400a44a66602c00229404c94ccc04ccdc79bae301900200414a226600600600260320026eb8c054c048dd50008a998082495965787065637420566572696669636174696f6e4b657943726564656e7469616c2873656c6c65725f706b6829203d0a2020202020206461742e73656c6c6572416464726573732e7061796d656e745f63726564656e7469616c0016300130113754600260226ea80248c050004526153300e4911856616c696461746f722072657475726e65642066616c7365001365632533300c300600115333010300f37540042930a998068048b0a99980618028008a99980818079baa002149854cc0340245854cc03402458c034dd5000a99999980900088008a998058038b0a998058038b0a998058038b0a998058038b192999804980198059baa004132533300e001153300b00816132325333010001153300d00a16132533301130140021324994ccc034c01cc03cdd500189929998090008a998078060b09919299980a0008a998088070b099299980a980c0010991924c64a666026601a002264a6660300022a6602a0242c264a66603260380042649319299980b1808000899299980d8008a9980c00a8b099299980e180f80109924c6602000202c2a6603202c2c64a66666604000220022a6603202c2c2a6603202c2c2a6603202c2c2a6603202c2c603a00260326ea800854ccc058c03c0044c94ccc06c00454cc060054584c8c94ccc07400454cc06805c584c8c94ccc07c00454cc070064584c94ccc080c08c008526153301d01a16325333333024001153301d01a16153301d01a16153301d01a161375a0022a6603a0342c6042002604200464a6666660440022a660360302c2a660360302c2a660360302c26eb400454cc06c06058c07c004c07c008c94cccccc08000454cc0640585854cc0640585854cc064058584dd68008a9980c80b0b180e800980c9baa002153301701416301737540022a6602c0262c64a66666603a00220022a6602c0262c2a6602c0262c2a6602c0262c2a6602c0262c6034002602c6ea800c54ccc04cc03000454ccc05cc058dd50018a4c2a660280222c2a660280222c60286ea8008cc02400c03c54cc04803c58c94cccccc064004400454cc04803c5854cc04803c5854cc04803c5854cc04803c58c058004c058008c94cccccc05c004400454cc0400345854cc0400345854cc0400345854cc04003458c050004c040dd50018a998070058b0a998070058b19299999980a8008a998070058b0a998070058b0a998070058b09bad001153300e00b16301200130120023253333330130011001153300c00916153300c00916153300c00916153300c009163010001300c37540082a6601400e2c4464a666016600a002264a6660200022a6601a0062c264a66602260280042930a998070020b19299999980a8008a998070020b0a998070020b0a998070020b0a998070020b09bae0013012001300e37540062a6660166008002264a6660200022a6601a0062c264a66602260280042930a998070020b19299999980a8008a998070020b0a998070020b0a998070020b0a998070020b09bae0013012001300e37540062a660180042c60186ea8008dc3a40046e1d2000533333300d001100115330060031615330060031615330060031615330060031649116616374696f6e3a204d61726b657452656465656d65720049010f6461743a2053696d706c6553616c65004901d8657870656374205b5f5d203d0a202020206c6973742e66696c746572280a2020202020206f7574707574732c0a202020202020666e286f757470757429207b0a2020202020202020286f75747075742e76616c7565203d3d2076616c293f20262620286f75747075742e61646472657373203d3d2073656c6c65725f61646472293f20262620646174756d5f74616767696e675f68617368280a202020202020202020206f75747075742c0a202020202020202020206f75745f7265662c0a2020202020202020293f0a2020202020207d2c0a2020202029005734ae7155ceaab9e5573eae815d0aba257481"


const Delegate = async () => {
  const network =
    process.env.NODE_ENV === "development"
      ? NetworkType.TESTNET
      : NetworkType.MAINNET;
  const { isConnected, usedAddresses, enabledWallet } = useCardano({
    limitNetwork: network,
  });

  const getWalletTokens = async (): Promise<Record<string,Token>> => {
    if (isConnected && enabledWallet) {
      try {
        const lucid = await Lucid(new Emulator([]), "Preprod");
        const api = await window.cardano[enabledWallet].enable();
        lucid.selectWallet.fromAPI(api);

        const utxos: UTxO[] = await lucid.wallet().getUtxos();
        const tokens: Token[] = [];

        for (const utxo of utxos) {
          const assets = utxo.assets;
          for (const [assetId, quantity] of Object.entries(assets)) {
            const { policyId, tokenName } = parseAssetId(assetId);
            tokens.push({
              policyId,
              tokenName,
              quantity: BigInt(quantity)
            });
          }
        }
        return aggregateTokens(tokens);
      } catch (error) {
        console.error("Failed to fetch wallet tokens:", error);
        return {};
      }
    }
    return {};
  };

  const [walletTokens, setWalletTokens] = useState<Record<string, Token>>({});

  useEffect(()=>{
    if (isConnected){
      getWalletTokens().then(aggregatedTokens => setWalletTokens(aggregatedTokens));
    }
  },[isConnected]);

  const handleAPI = async (param: TransactionType) => {
    if (isConnected && enabledWallet) {
      try {
        const lucid = await Lucid(new Emulator([]), "Preprod");
        const api = await window.cardano[enabledWallet].enable();
        lucid.selectWallet.fromAPI(api);
        let response;

      if (param === "Mint")
      {
        const body: NFTMinterConfig = {TokenName: "RyanCustom", address: usedAddresses[0]};
        response = await fetch("/api/mint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify(body),
        });
      } else if (param === "Lock") {
        console.log("reached lock");
        const body: LockNFTConfig = {priceOfAsset: (10_000_000n).toString(), policyID: tokenInfo.policyId , TokenName: tokenInfo.assetName! ,marketPlace: nftMarketPlace, sellerAddr: await lucid.wallet().address() };
        response = await fetch("/api/lock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } else if (param === "Withdraw") {
        const body: WithdrawNFTConfig = {marketplace: nftMarketPlace, sellerAddr: await lucid.wallet().address(), pid: tokenInfo.policyId};
        response = await fetch("/api/withdraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } else if (param === "Buy") {
        const body: BuyNFTConfig = {marketplace: nftMarketPlace, sellerAddr: await lucid.wallet().address() };
        response = await fetch("/api/buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } else {
        const body: NFTMinterConfig = {TokenName: "RyanCustom", address: usedAddresses[0]};
          response = await fetch("/api/mint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }      


        const { tx } = await response.json();
        const signedTx = await lucid.fromTx(tx).sign.withWallet().complete();
        const txh = await signedTx.submit();
        console.log(txh);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {isConnected ? (
        <div className="flex flex-row items-start gap-3 sm:gap-6 lg:gap-8 w-full">
          {/* Column for buttons */}
          <div className="flex flex-col items-center w-1/2">
          <h2 className="text-lg font-semibold mb-4">Functions</h2>
            <button className="btn btn-primary mb-4" onClick={() => handleAPI("Mint")}>
              Mint NFT
            </button>
            <button className="btn btn-primary mb-4" onClick={() => handleAPI("Lock")}>
              Lock NFT
            </button>
            <button className="btn btn-primary mb-4" onClick={() => handleAPI("Withdraw")}>
              Withdraw
            </button>
            <button className="btn btn-primary mb-4" onClick={() => handleAPI("Buy")}>
              Buy NFT
            </button>
          </div>
              
                      {/* Column for wallet tokens */}
            <div className="w-1/2">
            <h2 className="text-lg font-semibold mb-4">Tokens</h2>
               {Object.entries(walletTokens).map(([key, token], index) => (
                <div key={index} className="mb-4">
                  <h1 className="flex-grow">
                    <span>{token.tokenName}</span>
                    <span>{"...."}</span>
                    <span>{token.quantity.toString()}</span>
                  </h1>
                </div>
              ))}
            </div>
        </div>
      ) : null}
    </>
  );

};

export default Delegate;
