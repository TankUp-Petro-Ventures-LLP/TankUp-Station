/* eslint-disable space-before-function-paren */
/* eslint-disable object-shorthand */
/* eslint-disable no-var */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input() chartData;
  @ViewChild('chart', { static: true }) chart;
  ctx: any;

  ngOnInit() {
    this.buildChart();
  }
  buildChart() {
    this.ctx = new Chart(this.chart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: false,
            data: this.chartData.values,
            backgroundColor: "#FF7810",
            pointBackgroundColor: "white",
            pointBorderColor: "#FF7810",
            tension: 0.1,
          },
        ],
      },
      options: {
        animation: { animateRotate: true },
        responsive: true,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false
            },
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true
            },
            ticks: {
              beginAtZero: true
          }
          }]
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
            label: function (tooltipItems, data) {
              var i = tooltipItems.index;
              return (
                data.labels[i] + ': ' +' Rs.'+ data.datasets[0].data[i]
              );
            },
          },
        },
      },
    });
  }
}
