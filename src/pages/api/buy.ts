import { Blockfrost, Data, Lucid, Validator, UTxO, toHex, fromHex } from "@lucid-evolution/lucid";
import { NextApiRequest, NextApiResponse } from "next";
import { BuyNFTConfig } from "./apitypes";
import { MarketRedeemerEnum, OutputReference } from "./schemas";
import { queryNFT } from "./queryNFT";
import {C} from "lucid-cardano"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("test")
   if (req.method === "POST") {
  //   // Process a POST request
    const initLucid = async () => {
       if (process.env.NODE_ENV === "development") {
        const b = new Blockfrost(
          process.env.API_URL_PREPROD as string,
          process.env.BLOCKFROST_KEY_PREPROD as string 
        );
        return Lucid(b, "Preprod");
      } else {
        const b = new Blockfrost(
          process.env.API_URL_MAINNET!,
          process.env.BLOCKFROST_KEY_MAINNET!
        );
        return Lucid(b, "Mainnet");
      }  
      
    };


    const lucid = await initLucid();
    const {marketplace, sellerAddr, pid}: BuyNFTConfig = req.body; 
    console.log(sellerAddr);   
    
    lucid.selectWallet.fromAddress(sellerAddr, [])

    const buyUtxo: UTxO[] = await queryNFT(lucid, marketplace, 10_000_000n, sellerAddr, pid);
    console.log(buyUtxo);
  
    const myData: OutputReference  = {
        transaction_id: buyUtxo[0].txHash,
        output_index: BigInt(buyUtxo[0].outputIndex)
    };  
   
    const d = Data.to(myData,OutputReference);
    const d2 = Data.to(toHex(C.hash_blake2b256(fromHex(d))));  
    console.log("out ref cbor: ",d);

    const contract: Validator = {
        type: "PlutusV2",
        script: marketplace,
      };
    
      const redeemer = Data.to("Buy", MarketRedeemerEnum);
      const tx = await lucid
          .newTx()
          .pay.ToAddressWithData(sellerAddr, 
            {
              kind: "inline",
              value: d2,
            },
            {lovelace: 10_000_000n}
          )
          .collectFrom(buyUtxo, redeemer)
          .attach.SpendingValidator(contract)
          .complete();
    res.status(200).json({ tx: tx.toCBOR() });
    console.log(tx.toCBOR());
  } else {
    // Handle any other HTTP method
  }
}

export const parse = (json: string) =>
  JSON.parse(json, (key, value) =>
    typeof value === "string" && /^\d+n$/.test(value)
      ? BigInt(value.slice(0, -1))
      : value
  );
