import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Config } from 'src/app/configuration/config';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';

@Component({
  selector: 'app-fuelent-fillings',
  templateUrl: './fuelent-fillings.page.html',
  styleUrls: ['./fuelent-fillings.page.scss'],
})
export class FuelentFillingsPage {
  fillingsRecord= [];
  scroll= true;
  page=1
  totalPages: any;
  fillingsLength= null;
  vendor_id: any;

  constructor(
    private apiTalk:ApiTalkService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.vendor_id =
          this.router.getCurrentNavigation().extras.state.vendor_id;
      }
    });
   }

  ngAfterViewInit() {
    this.fillingsRecord= [];
    this.page=1
    this.getFillingDetails(this.page)
  }

  async getFillingDetails(page) {
   return await this.apiTalk
    .getData(Config.API_URL + 'fuelents/'+ this.vendor_id+'/fillings'+'?page=' +
    page +
    '&limit=10')
    .then((res) => {
      if(res['json'].fillings){
        this.fillingsRecord = res['json'].fillings;
        this.fillingsLength= this.fillingsRecord.length;
        this.totalPages = res['json'].totalPages;
        if (this.fillingsRecord.length >= res['json'].totalCount || page > this.totalPages) {
          this.scroll = false;
        }
        console.log(res['json']);
      }
    });
  }

  async loadData(event) {
    this.page += 1;
    setTimeout(async () => {
      await this.getFillingDetails(this.page)
          event.target.complete();
    }, 500);
  }

  doRefresh(event) {
    setTimeout(async () => {
      this.fillingsRecord= [];
      this.page=1
      await this.getFillingDetails(this.page)
      await event.target.complete();
    }, 2000);
  }

  async back(){
    await this.navCtrl.pop()
  }
}
