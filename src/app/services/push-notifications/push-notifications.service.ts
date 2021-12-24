import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { ApiTalkService } from '../api-talk/api-talk.service';
import { Device } from '@capacitor/device';
import { PushNotifications, PushNotificationToken, PushNotificationSchema, PushNotificationActionPerformed } from '@capacitor/push-notifications';
import { LocalNotificationActionPerformed, LocalNotifications } from '@capacitor/local-notifications';
import { Config } from 'src/app/configuration/config';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(
    private apiTalkService: ApiTalkService,
    private navCtrl: NavController
  ) { }

  public async initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  private async registerPush() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    await LocalNotifications.requestPermissions();

    PushNotifications.addListener(
      'registration',
      async (token: PushNotificationToken) => {
        const obj = {
          token: token.value,
          device_uuid: (await Device.getId()).uuid,
        };
        await this.apiTalkService.postData(Config.API_URL + 'push-notification/token', obj);
      },
    );

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        if(data){
          // this.navCtrl.navigateRoot('')
        }
      },
    );

    }}
