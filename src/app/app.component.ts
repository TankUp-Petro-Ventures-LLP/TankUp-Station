import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { UpdateService } from './services/update/update.service';
import { Location } from '@angular/common';
import { ComponentService } from './services/components/component.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  LoggedIn: any;
  user: any;
  constructor(
    private storage: Storage,
    private platform: Platform,
    private updateService: UpdateService,
    private _location: Location,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private cp: ComponentService

  ) {
    this.cp.currentEvent.subscribe(data=>{
      this.user= data.user
     });
    this.storage.create();
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      await this.start();
      this.updateService.checkForMaintenance();
      this.updateService.checkForUpdate();
      this.platform.backButton.subscribeWithPriority(1, (processNextHandler) => {
        if (this._location.isCurrentPathEqualTo('/home') || this._location.isCurrentPathEqualTo('/login')) {
          this.showExitConfirm();
          processNextHandler();
        }
        else{
          this._location.back();
        }
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do Objectany higher level native things you might need.
    });
  }

  async start() {
    this.user = await this.cp.storageGet('user');
    this.LoggedIn = await this.cp.storageGet('isLoggedIn');
     if(this.LoggedIn && this.user){
       this.navCtrl.navigateRoot(['/home'])
     }
     else{
       this.navCtrl.navigateRoot(['/login'])
     }
  }

  showExitConfirm() {
    this.alertCtrl.create({
      header: 'App termination',
      message: 'Do you want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Stay',
        role: 'cancel',
        handler: () => {
        }
      }, {
        text: 'Exit',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

  async logout() {
    await this.cp.presentLoadingText('Loging Out');
    await this.cp.removeAll();
    await this.cp.dismissLoading();
    await this.navCtrl.navigateRoot('/login');
  }
  
}
