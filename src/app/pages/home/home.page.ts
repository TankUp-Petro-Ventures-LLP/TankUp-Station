import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Config } from 'src/app/configuration/config';
import { HalfModalPage } from 'src/app/half-modal/half-modal.page';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';
import { ComponentService } from 'src/app/services/components/component.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public oiler = 'assets/icon/fuel.svg';
  public money = 'assets/icon/Group 382.svg';
  public reduce = 'assets/icon/Group 383.svg';
  status: boolean = false;

  // pendingFillings=[
  //   {id:1, vendor_name:"Royal Petro", quantity:3000, address:"Gomti nagar, lucknow", vehicle: "UP32 MF 4410", filling_date: "12 Nov, 2021", rate: 98.23, preffered_time:"7pm to 10pm"}
  // ]
  user: any;
  pendingFillings= [];
  fillingsLength = null
  glance: any;
  totalRevenue: any;
  constructor(private cp: ComponentService, private apiTalk: ApiTalkService, private modalController: ModalController) { }

  async ngOnInit() {
    this.user = await this.cp.storageGet('user');
    await this.getGlanceData();
    await this.updatePost(this.user);
    await this.getPendingFillings();
  }
  async getGlanceData() {
    return await this.apiTalk
    .getData(Config.API_URL + 'home/glance')
    .then((res) => {
      this.glance= res['json'];
      this.totalRevenue= +this.glance?.totalRevenue;
      this.totalRevenue= this.totalRevenue.toFixed(2)
      console.log(this.glance)
    });
  }

  async ngAfterViewInit(){
    await this.getPendingFillings();
  }

  async updatePost(user){
    await this.cp.publish({user: user});
} 

  async getPendingFillings(){
    return await this.apiTalk
    .getData(Config.API_URL + 'filling/pending')
    .then((res) => {
      this.pendingFillings = res['json'].fillings;
      this.fillingsLength= this.pendingFillings.length
      console.log(res['json']);
    });
  }

  async setRate(){
    const modal = await this.modalController.create({
      component: HalfModalPage,
      componentProps:{
        rate:this.glance?.rate,
      },
      cssClass: 'half-modal'
    });
    
    modal.onDidDismiss().then(async (dataReturned) => {
      console.log(dataReturned)
      if (dataReturned.data) {
        return await this.apiTalk
        .patchData(Config.API_URL + 'home/set-rate',dataReturned?.data?.values)
        .then(async (res) => {
          console.log(res['json']);
          await this.getGlanceData()
          await this.cp.presentToast(res['json'].message)
        });
      }
    });
    return await modal.present();
  }

  opencard(order){
    this.status = !this.status;       
    order.openCard= this.status
  }

  doRefresh(event) {
    setTimeout(async () => {
      await this.getPendingFillings();
      await event.target.complete();
    }, 2000);
  }
}
