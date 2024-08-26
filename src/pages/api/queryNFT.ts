import { Data, LucidEvolution, UTxO, Validator, validatorToAddress } from "@lucid-evolution/lucid";
import { fromAddress, SimpleSaleDatum } from "./schemas";


// get all utxos
// filter right datum
// return [reaable_utxos]  return not cbor but price of asset and seller address 

//how does the buy know what the seller address is in this???

export const queryNFT = async (lucid: LucidEvolution, contractCbor: string, purchasePrice: bigint): Promise<UTxO[]> => {

  const contract: Validator = {
    type: "PlutusV2",
    script: contractCbor,
  };
  const contractAddr = validatorToAddress("Preprod", contract);


  const allContractUtxos = await lucid.utxosAt(contractAddr);
  const allUserContractUtxos = allContractUtxos.filter(async (value) => {
    if (value.datum) {
      const datum = Data.from(value.datum, SimpleSaleDatum);
      const price_equal = datum.priceOfAsset === purchasePrice;
      const same_addr = JSON.stringify(datum.sellerAddress) === JSON.stringify(fromAddress(await lucid.wallet().address()));
      price_equal && same_addr;   
     }       
  }
  );

  return allUserContractUtxos;

}