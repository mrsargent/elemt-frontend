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
const nftMarketPlace = "590bd3010000323232323232323232323232232323232232322533300d3232533300f300930113754002264a666020601460246ea80184c8ccc8c8c8c8c8c888c8c8c94ccc070c054c078dd5001099191929998118008a9981000f0b0a99981198130008a51153302001e16323300100100422533302400114bd700991929998112999811299981119baf3012302537540046e980145288a99811a491b6f75747075742e76616c7565203d3d2076616c203f2046616c73650014a02a666044a66604466ebcc054c094dd50010050a5115330234901256f75747075742e61646472657373203d3d2073656c6c65725f61646472203f2046616c73650014a02a66604464a660486e64cc03400522010013375e605260546054604c6ea800c004cdd2a40086604e6ea4dca1bb30064bd700a51153302349012b646174756d5f74616767696e675f68617368286f75747075742c206f75745f72656629203f2046616c73650014a029405280998138011980200200089980200200098140011813000a99980e980b8030a5eb7bdb1804c8c8cc0040052f5bded8c044a66604800226604a66ec1301014000374c00697adef6c60132323232533302433720910100002133029337609801014000374c00e00a2a66604866e3d22100002133029337609801014000374c00e00626605266ec0dd48011ba6001330060060033756604c0066eb8c090008c0a0008c098004c8cc0040052f5bded8c044a66604600226604866ec13001014000375001097adef6c60132323232533302333720910100002133028337609801014000375001800a2a66604666e3d22100002133028337609801014000375001800626605066ec0dd48011ba800133006006003375a604a0066eb8c08c008c09c008c094004c088c07cdd50010a9980ea4811f657870656374205370656e64286f75745f72656629203d20707572706f736500163758604260446044603c6ea8c084008c080c084004c070dd50069800800911299999981000109919191919191980580100099b8a4881012800002533301c337100069007099b80483c80400c54ccc070cdc4001a410004266e00cdc0241002800690068a9980ea4929576861742061726520796f7520646f696e673f204e6f2049206d65616e2c20736572696f75736c792e0016533301f0011337149101035b5d2900004133714911035b5f2000375c6042604466600e00266040980102415d0033020375266e2922010129000044bd70111981126103422c200033022375266601001000466e28dd718080009bae300d0014bd701bac301d002375a60360026466ec0dd4180d8009ba7301c0013754004264a66603a002266e292201027b7d00002133714911037b5f2000375c603e604064646600200200644a6660400022006266446604698103422c2000330233752666012012604000466e292201023a20003330090093021002337146eb8c044004dd71807000a5eb80c088004cc008008c08c004cc0793010342207d003301e375200497ae03756004264a66603a002266e29221025b5d00002133714911035b5f2000375c603e604066600a0026603c980102415d003301e375200497ae022330204c0103422c200033020375266600c00c00466e28dd718070009bae300b0014bd701bac002133005375a0040022646466e292210268270000132333001001337006e34009200133714911012700003222533301c3371000490000800899191919980300319b8000548004cdc599b80002533301f33710004900a0a40c02903719b8b33700002a66603e66e2000520141481805206e0043370c004901019b8300148080cdc70020011bae002222323300100100422533301d0011004133003301f001330020023020001223233001001003225333017301100113371491101300000315333017337100029000099b8a489012d003300200233702900000089980299b8400148050cdc599b803370a002900a240c00066002002444a66602866e2400920001001133300300333708004900a19b8b3370066e14009201448180004dd69800980a1baa00c3004301437540184602e6030002264660020026eb0c05cc060c060c060c060c060c060c060c060c050dd51802180a1baa00522533301600114a0264a66602666e3cdd7180c8010020a511330030030013019001375c602a60246ea800454cc04124015965787065637420566572696669636174696f6e4b657943726564656e7469616c2873656c6c65725f706b6829203d0a2020202020206461742e73656c6c6572416464726573732e7061796d656e745f63726564656e7469616c0016300130113754600260226ea80248c050004526153300e4911856616c696461746f722072657475726e65642066616c7365001365632533300c300600115333010300f37540042930a998068048b0a99980618028008a99980818079baa002149854cc0340245854cc03402458c034dd5000a99999980900088008a998058038b0a998058038b0a998058038b0a998058038b192999804980198059baa004132533300e001153300b00816132325333010001153300d00a16132533301130140021324994ccc034c01cc03cdd500189929998090008a998078060b09919299980a0008a998088070b099299980a980c0010991924c64a666026601a002264a6660300022a6602a0242c264a66603260380042649319299980b1808000899299980d8008a9980c00a8b099299980e180f80109924c6602000202c2a6603202c2c64a66666604000220022a6603202c2c2a6603202c2c2a6603202c2c2a6603202c2c603a00260326ea800854ccc058c03c0044c94ccc06c00454cc060054584c8c94ccc07400454cc06805c584c8c94ccc07c00454cc070064584c94ccc080c08c008526153301d01a16325333333024001153301d01a16153301d01a16153301d01a161375a0022a6603a0342c6042002604200464a6666660440022a660360302c2a660360302c2a660360302c26eb400454cc06c06058c07c004c07c008c94cccccc08000454cc0640585854cc0640585854cc064058584dd68008a9980c80b0b180e800980c9baa002153301701416301737540022a6602c0262c64a66666603a00220022a6602c0262c2a6602c0262c2a6602c0262c2a6602c0262c6034002602c6ea800c54ccc04cc03000454ccc05cc058dd50018a4c2a660280222c2a660280222c60286ea8008cc02400c03c54cc04803c58c94cccccc064004400454cc04803c5854cc04803c5854cc04803c5854cc04803c58c058004c058008c94cccccc05c004400454cc0400345854cc0400345854cc0400345854cc04003458c050004c040dd50018a998070058b0a998070058b19299999980a8008a998070058b0a998070058b0a998070058b09bad001153300e00b16301200130120023253333330130011001153300c00916153300c00916153300c00916153300c009163010001300c37540082a6601400e2c4464a666016600a002264a6660200022a6601a0062c264a66602260280042930a998070020b19299999980a8008a998070020b0a998070020b0a998070020b0a998070020b09bae0013012001300e37540062a6660166008002264a6660200022a6601a0062c264a66602260280042930a998070020b19299999980a8008a998070020b0a998070020b0a998070020b0a998070020b09bae0013012001300e37540062a660180042c60186ea8008dc3a40046e1d2000533333300d001100115330060031615330060031615330060031615330060031649116616374696f6e3a204d61726b657452656465656d65720049010f6461743a2053696d706c6553616c65004901d8657870656374205b5f5d203d0a202020206c6973742e66696c746572280a2020202020206f7574707574732c0a202020202020666e286f757470757429207b0a2020202020202020286f75747075742e76616c7565203d3d2076616c293f20262620286f75747075742e61646472657373203d3d2073656c6c65725f61646472293f20262620646174756d5f74616767696e675f68617368280a202020202020202020206f75747075742c0a202020202020202020206f75745f7265662c0a2020202020202020293f0a2020202020207d2c0a2020202029005734ae7155ceaab9e5573eae815d0aba257481"


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
        const body: BuyNFTConfig = {marketplace: nftMarketPlace, sellerAddr: await lucid.wallet().address(), pid: tokenInfo.policyId };
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
