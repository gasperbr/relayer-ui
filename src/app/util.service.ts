import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getEtherscan(address: string | undefined, chainId: number | undefined): string {
    if (address || chainId) {
      if (chainId === 137) return `https://polygonscan.com/address/${address}`;
    }
    return "";
  }

  getContract(chainId: number | undefined): string {
    if (chainId === 137) return "0x1aDb3Bd86bb01797667eC382a0BC6A9854b4005f";
    return "";
  }

  getTenderly(chainId: number | undefined): string {
    if (chainId === 137) return "https://dashboard.tenderly.co/Sushi/limitorder/contract/polygon/0x1adb3bd86bb01797667ec382a0bc6a9854b4005f";
    return "";
  }

}
