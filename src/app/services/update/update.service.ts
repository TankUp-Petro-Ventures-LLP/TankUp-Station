import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { Config } from 'src/app/configuration/config';
import { Market } from '@ionic-native/market/ngx';

@Injectable({
  providedIn: 'root',
})

export class UpdateService {
  update= Config.API_URL+"app-update.json"
  maintenance= Config.API_URL+"maintenance.json"

  constructor(private http: HttpClient, private alertCtrl: AlertController,
    private appVersion: AppVersion,
    private iab: InAppBrowser,
    private market: Market) { }
  
  async checkForMaintenance(){
    this.http.get(this.maintenance).subscribe((info: Maintenance)=>{
      if(info?.enabled){
        this.presentAlert(info.msg?.title, info?.msg?.msg)
      }
    })
  }
  async checkForUpdate(){
    const versionNumber = await this.appVersion.getVersionNumber();
    const splittedVersion= versionNumber.split('.');
    this.http.get(this.update).subscribe((info: AppUpdate)=>{
      const serverVersion = info?.current.split('.');
      if(serverVersion[0] > splittedVersion[0]){
        this.presentAlert(info?.majorUpdate?.title, info?.majorUpdate?.msg, info?.majorUpdate?.btn)
      }
      else if(serverVersion[1] > splittedVersion[1]){
        this.presentAlert(info?.minorUpdate?.title, info?.minorUpdate?.msg, info?.minorUpdate?.btn, true)
      }
    })
  }

  updateApplication(){
    this.market.open('com.tankup.ownerapp')
  }

  async presentAlert(header, message, btnText='', allowClose=false){
    const buttons=[]

    if(btnText != ''){
      buttons.push({
        text: btnText,
        handler:()=>{
          this.updateApplication()
        }
      })
    }
    if(allowClose){
      buttons.push({
        text:"Close",
        role:"cancel"
      })
    }
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons,
      backdropDismiss: allowClose,
      mode: "ios"
    });
    alert.present();
  }
}
interface AppUpdate{
  current:string;
  majorUpdate?: {
    title: string;
    msg: string;
    btn: string;
},
  minorUpdate?: {
    title: string;
    msg: string;
    btn: string;
}
}
interface Maintenance{
  enabled: boolean;
  msg:{
    title:string;
    msg:string;
    btn:string;
  }
}