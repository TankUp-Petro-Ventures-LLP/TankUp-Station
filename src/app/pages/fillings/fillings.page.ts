import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/configuration/config';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';

@Component({
  selector: 'app-fillings',
  templateUrl: './fillings.page.html',
  styleUrls: ['./fillings.page.scss'],
})
export class FillingsPage {
  fillingsRecord= [];
  scroll= true;
  page=1
  totalPages: any;
  fillingsLength= null;
  constructor(private apiTalk: ApiTalkService) { }

  ngAfterViewInit() {
    this.fillingsRecord= [];
    this.page=1
    this.getFillings(this.page)
  }

  async getFillings(page){
    return await this.apiTalk
    .getData(Config.API_URL + 'filling?page=' +
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
      await this.getFillings(this.page)
          event.target.complete();
    }, 500);
  }

  doRefresh(event) {
    setTimeout(async () => {
      this.fillingsRecord= [];
      this.page=1
      await this.getFillings(this.page)
      await event.target.complete();
    }, 2000);
  }

}
