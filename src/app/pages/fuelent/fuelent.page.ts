import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Config } from 'src/app/configuration/config';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';
import { ComponentService } from 'src/app/services/components/component.service';

@Component({
  selector: 'app-fuelent',
  templateUrl: './fuelent.page.html',
  styleUrls: ['./fuelent.page.scss'],
})
export class FuelentPage implements OnInit {
  fuelentList=[]
  fillings: any;
  fuelentLength= null;
  
  constructor(private apiTalk: ApiTalkService, private cp: ComponentService, private navCtrl: NavController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getfuelentList();
  }
  async getfuelentList() {
    return await this.apiTalk
    .getData(Config.API_URL + 'fuelents')
    .then((res) => {
      this.fuelentList = res['json'];
      this.fuelentLength= this.fuelentList.length
      console.log(res['json'])
      for(let i = 0; i<this.fuelentList.length; i++){
        this.fuelentList[i].initial=  this.fuelentList[i].vendor_name.charAt(0)
      }
    });
  }

  async showFillings(vendor_id){
    await this.cp.presentLoading()
      let navigationExtras: NavigationExtras = {
        state: { vendor_id },
      };
      await this.cp.dismissLoading();
      await this.navCtrl.navigateForward('fuelent-fillings', navigationExtras);
  }

  call(number){
    Config.makeCall(number);
  }

  mail(){
    this.cp.presentToast("Mailing service currently not available.")
  }

 async setDiscount(vendor){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header:"Change discount",
      inputs: [
        {
          name: 'discount',
          type: 'number',
          placeholder: vendor?.discount,
          
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            if(alertData.discount){
              this.changeDiscount(alertData,vendor);
            }
            else{
              this.cp.presentToast("Please provide the required information.")
            }
          }
        }
      ],
      mode:'ios'
    });
   alert.present();
  }

  async changeDiscount(alertData, vendor){
    console.log(alertData)
    return await this.apiTalk
        .patchData(Config.API_URL + 'fuelents/'+vendor?.vendor_id+'/set-discount',alertData)
        .then(async (res) => {
          await this.getfuelentList()
          await this.cp.presentToast("Discount changed successfully")
        });
  }

  doRefresh(event) {
    setTimeout(async () => {
      await this.getfuelentList();
      await event.target.complete();
    }, 2000);
  }
}
