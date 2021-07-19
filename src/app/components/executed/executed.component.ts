import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from  "chart.js";
Chart.register(...registerables);

@Component({
  selector: 'app-executed',
  templateUrl: './executed.component.html',
  styleUrls: ['./executed.component.css']
})
export class ExecutedComponent implements OnChanges {

  length = 21;

  labels = [...Array(this.length)].map((_, i) => {
    const d = new Date();
    d.setTime(d.getTime() - i * 86400000)
    return (new Date(d.getFullYear(), d.getMonth(), d.getDate()))}
  ).reverse();

  chartData = {
    labels: this.labels.map(d => `${d.getDate()}. ${1 + d.getMonth()}`),
    datasets: [{
      label: 'Failed fills',
      data: [...Array(this.length)].map(() => 0),
      backgroundColor: [
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgb(255, 159, 64)',
      ],
      borderWidth: 1
    },
    {
      label: 'Successful fills',
      data: [...Array(this.length)].map(() => 0),
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgb(75, 192, 192)',
      ],
      borderWidth: 1
    },
    {
      label: 'Received orders',
      type: 'line' as any,
      data: [...Array(this.length)].map(() => 0),
      yAxisID: 'b'
    }
  ]
  };

  config: ChartConfiguration = {
    type: 'bar',
    data: this.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        a: {
          type: 'linear',
          position: 'left',
          grid: {
            display: false
          }
        },
        b: {
          type: 'linear',
          position: 'right',

        },
      }
    },
  };

  constructor() {
  }

  @Input() orderStatusCount: any[] = [];

  @Input() receivedOrdersCount: any[] = [];

  chart: Chart | undefined = undefined;

  ngOnChanges(changes: SimpleChanges) {

    if (this.chart) this.chart.destroy();

    // this.chartData.datasets[0].data = this.labels.map(() => 0);
    // this.chartData.datasets[1].data = this.labels.map(() => 0);
    // this.chartData.datasets[2].data = this.labels.map(() => 0);

    const orders = changes.orderStatusCount?.currentValue;
    const receivedOrders = changes.receivedOrdersCount?.currentValue;

    if (orders) {

      orders.forEach((order: any) => order.date = new Date(order.createdAt));

      orders.forEach((order: any) => {

        for (let i = 0; i < this.labels.length - 1; i++) {

          if (order.date >= this.labels[i] && order.date < this.labels[i + 1]) {
            if (order.status === 1) {
              this.chartData.datasets[1].data[i]++;
            } else if (order.status === 0) {
              this.chartData.datasets[0].data[i]++;
            }

            break;

          }

        }

        if (order.date >= this.labels[this.length - 1]) {

          if (order.status === 1) { // 1 means success
            this.chartData.datasets[1].data[this.length - 1]++;
          } else if (order.status === 0) { // 0 means failure
            this.chartData.datasets[0].data[this.length - 1]++;
          }

        }

      });
    }

    if (receivedOrders) {


      receivedOrders.forEach((order: any) => order.date = new Date(order.timestamp));

      receivedOrders.forEach((data: any) => {

        for (let i = 0; i < this.labels.length - 1; i++) {
          if (data.date >= this.labels[i] && data.date < this.labels[i + 1]) {

            this.chartData.datasets[2].data[i] = data.counter;
            break;

          }
        }

        if (data.date >= this.labels[this.length - 1]) {

          this.chartData.datasets[2].data[this.length - 1] = data.counter

        }

      });
    }

    this.config.data = this.chartData;

    this.chart = new Chart(document.getElementById('executedOrdersChart') as any, this.config);
  }

}
