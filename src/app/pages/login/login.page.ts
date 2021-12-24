import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Config } from 'src/app/configuration/config';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';
import { ComponentService } from 'src/app/services/components/component.service';
import { PushNotificationsService } from 'src/app/services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: FormGroup;
  public phone_number;
  public newUser = false;
  public newUserObj;
  public otp: any;
  public nu = false;
  OTP: any = {
    first: '',
    second: '',
    third: '',
    forth: '',
    fifth: '',
  };
  numberObj: any;
  public resendEnable = true;
  public enableCallme = false;
  public time: BehaviorSubject<string> = new BehaviorSubject('00:00');
  public timer: any;
  public showResendTimer = false;
  public showCallmeTimer = false;
  otpLength = 0;
  public showOTP=false

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private apiTalk: ApiTalkService,
    private cp: ComponentService, 
    private pushNotificationService: PushNotificationsService,
  ) {
    this.user = this.formBuilder.group({
      phone_number: [
        '',
        Validators.compose([
          Validators.pattern('^[1-9][0-9]{9}$'),
          Validators.required,
        ]),
      ],
    });
  }

  ngOnInit() {
  }

  async goToSignUp() {
    await this.cp.presentLoading();
    await this.navCtrl.navigateForward('/sign-up');
    await this.cp.dismissLoading();
  }

  async sendOTP() {
    let obj = {
      phone_number: JSON.stringify(this.user.value['phone_number']),
    };
    this.cp.presentLoading();
    try {
      this.apiTalk
        .postData(Config.API_URL + 'auth/' + 'send-otp', obj)
        .then(async (res) => {
          if (res['json']) {
            await this.cp.dismissLoading();
            await this.cp.presentToast(res['json'].message)
            this.showOTP=true
            this.timer = 30;
            this.resendEnable = false;
            this.showResendTimer = true;
            setInterval(() => {
              this.updateTimeValue();
            }, 1000);
          } else {
            await this.cp.presentToast(res.message)
            await this.cp.dismissLoading();
          }
        });
    } catch (e) {
      this.cp.dismissLoading();
    }
  }

  onotpChange($event) {
    this.otp = $event;
    this.otpLength=this.otp.toString().length
  }

  async verifyotp() {
    await this.cp.presentLoading();
    let obj = { phone_number: JSON.stringify(this.user.value['phone_number']), otp: this.otp };
    console.log(obj)
    await this.apiTalk
      .postData(Config.API_URL + 'auth/' + 'login', obj)
      .then(async (res) => {
        console.log(res)
        if (res.status === 200) {
          await this.cp.storageSet('user', res['json']);
          this.cp.dismissLoading();
            await this.cp.storageSet('isLoggedIn', true);
            this.cp.presentToast(res['json'].msg);
            await this.navCtrl.navigateRoot('home');
            // await this.pushNotificationService.initPush();
          }
         else {
          await this.cp.presentToast(res.message)
          await this.cp.dismissLoading();
        }
      });
  }

  updateTimeValue() {
    let minutes: any = this.timer / 60;
    let seconds: any = this.timer % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.time.next(text);

    --this.timer;

    if (this.timer < 0) {
      this.resendEnable = true;
      this.showResendTimer = false;
      this.showCallmeTimer = false;
      this.enableCallme = true;
    }
  }
}
