import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  chainId: number = 137;
  relayerAddress = "0x123B749C6aAE8761c4907a784bB8845e67991594";
  executedOrders = [];
  receivedOrders = [];
  logs = "Loading data ...";
  loadingData = 0;

  constructor() {}

  ngOnInit() {
    this.getData();
  }

  setChain(value: number) {
    this.chainId = value;
    this.getData();
  }

  async getData() {

    this.loadingData = 0;

    const to = (new Date()).getTime();

    const from = to - (1000 * 60 * 60 * 24 * 21);

    axios(`${environment.apiUrl}/api/executed-orders?from=${from}&to=${to}&chainId=${this.chainId}`, {
      headers: {"Access-Control-Allow-Origin": "*"}
    }).then(eoResponse => {
      this.executedOrders = eoResponse.data;
      console.log('got executed orders')
      this.loadingData++;
    });

    axios(`${environment.apiUrl}/api/received-orders-count?from=${from}&to=${to}&chainId=${this.chainId}`, {
      headers: {"Access-Control-Allow-Origin": "*"}
    }).then(roResponse => {
      this.receivedOrders = roResponse.data;
      console.log('got received orders')
      this.loadingData++;
    });

    axios(`${environment.apiUrl}/api/logs?from=${from}&to=${to}&chainId=${this.chainId}`, {
      headers: {"Access-Control-Allow-Origin": "*"}
    }).then(logResponse => {
      this.logs = logResponse.data.out;
    });

  }

}
