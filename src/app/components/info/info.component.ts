import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { BigNumber } from 'ethers';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnChanges {

  @Input() chainId?: number;
  @Input() relayerAddress?: string;

  balance: string | undefined;

  constructor(
    public utilService: UtilService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chainId.currentValue > 0 && changes.relayerAddress.currentValue) {
      this.getBalance();
    }
  }

  async getBalance() {
    this.balance = undefined;
    if (this.chainId === 137) {
      const response: any = await axios(`https://api.polygonscan.com/api?module=account&action=balance&address=${this.relayerAddress}&tag=latest&apikey=${environment.polygonScanKey}`)
      const _balance = BigNumber.from(response.data.result).div(1e12).toString(); // 6 decimals extra
      if (_balance.length < 7) {
        this.balance = '0.' + '0'.repeat(6 - _balance.length) + _balance;
      } else {
        this.balance = [_balance.slice(0, _balance.length - 6), '.', _balance.slice(_balance.length - 6, _balance.length)].join('');
      }
      this.balance = this.balance + ' MATIC';
    }
  }

}
