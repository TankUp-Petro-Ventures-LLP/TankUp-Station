import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/configuration/config';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage {
  fuelentData=[
    {id:1, name:"TankUp Petro Ventures LLP", current:10000, previous: 12033},
    {id:2, name:"Royal Petro Park", current:10000, previous: 12033},
  ];
  vendor_label=[];
  vendor_name=[];
  total_revenue=[];
  chartData:any;
  // chartData = {labels:['TUV','RPP'],values:[2000,6144]}    
  glance: any;
  previousMonthSale: any;
  currentMonthSale: any;
  currentSaleLength= null;
  previousSaleLength= null;
  selectTabs='current'

  constructor(private apiTalk: ApiTalkService) { }

  async ngAfterViewInit() {
    await this.getMonthlyCount();
    await this.getTotalRevenue();
  }
  async getTotalRevenue() {
    return await this.apiTalk
    .getData(Config.API_URL + 'analytics/vendor-total-revenue')
    .then((res) => {
      console.log(res['json'])
      for(let i=0; i<res['json'].length; i++){
        this.vendor_label[i]=res['json'][i]?.vendor_label || [];
        this.vendor_name[i]=res['json'][i]?.vendor_name || [];
        let revenue : number= res['json'][i]?.totalRevenue;
        this.total_revenue[i]=+revenue || [];
      }
      this.chartData= {
        labels:this.vendor_label,
        values:this.total_revenue,
        vendor_name:this.vendor_name
      }
    });
  }

  async getMonthlyCount() {
    return await this.apiTalk
    .getData(Config.API_URL + 'analytics/monthly-count')
    .then((res) => {
      this.glance= res['json'];
      this.previousMonthSale= res['json']?.previousMonthSale;
      this.previousSaleLength= this.previousMonthSale.length
      for(let i=0; i<this.previousMonthSale.length; i++){
        this.previousMonthSale[i].id= i+1;
      }

      this.currentMonthSale= res['json']?.currentMonthSale;
      this.currentSaleLength= this.currentMonthSale.length
      for(let i=0; i<this.currentMonthSale.length; i++){
        this.currentMonthSale[i].id= i+1;
      }
    });
  }

}
