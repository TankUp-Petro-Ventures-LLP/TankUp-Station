/* eslint-disable curly */
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  private dataObserved = new BehaviorSubject<any>('');
  currentEvent = this.dataObserved.asObservable();
  isLoading = false;
  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    private storage: Storage,public alertController:AlertController
  ) {}

  publish(param):void {
    this.dataObserved.next(param);
  }
  
  async presentAlertConfirm(header: any,message: any,cancelText: any,okText: any): Promise<any> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        mode:'ios',
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {
              resolve('cancel');
            }
          }, {
            text: okText,
            handler: (ok) => {
              resolve('ok');
            }
          }
        ]
      });
      alert.present();
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'light',
      mode:"ios"
    });
    toast.present();
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        spinner: 'circular',
        message: 'Loading Please Wait...',
        duration: 10000,
        mode:"ios"
        // duration: 5000,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }
  removeAll() {
    return this.storage.clear();
  }

  //spinner
  async presentLoadingText(msg) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: msg,
      spinner: 'dots',
      duration: 4000,
      mode:"ios"
    });
    await loading.present();
  }
  
  async dismissLoading() {
    this.isLoading = false;
    const popover = await this.loadingController.getTop();
    if (popover)
      return await this.loadingController
        .dismiss(null)
        .then(() => console.log('dismissed'));
  }

  storageSet(key: string, value: any) {
    return this.storage.set(key, value);
  }

  storageRemove(key) {
    return this.storage.remove(key);
  }

  storageGet(key) {
    return this.storage.get(key);
  }
}
