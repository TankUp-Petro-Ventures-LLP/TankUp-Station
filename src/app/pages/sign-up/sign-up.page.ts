import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Config } from 'src/app/configuration/config';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';
import { ComponentService } from 'src/app/services/components/component.service';
import { StationInfo } from '../station-info';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  stationInfo: FormGroup;
  stationDetails: StationInfo;
  oilCompanysList: any;
  isSubmitted= false;
  alreadyRegistered = false;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private apiTalk: ApiTalkService,
    private cp: ComponentService, 
  ) {
    this.stationInfo = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['',
      Validators.compose([Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),Validators.required]),
    ],
      representative_name: ['', Validators.required],
      phone_number: [
        '',
        Validators.compose([
          Validators.pattern('^[1-9][0-9]{9}$'),
          Validators.required,
        ]),
      ],
      
      gst: ['', Validators.compose([
        Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
        Validators.required,
      ]),],
      address: ['', Validators.required],
      dealer_code: ['', Validators.required],
      oil_company_id: ['', Validators.required],
    });
   }

  async ngOnInit() {
    await this.getOilCompanies();
  }

  async getOilCompanies() {
    return await this.apiTalk
      .getData(Config.API_URL + 'home/oil-company-list')
      .then((res) => {
        this.oilCompanysList = res['json'];
      });
  }

  get errorControl() {
    return this.stationInfo.controls;
  }

  async signUp() {
    await this.cp.presentLoading();
    this.isSubmitted = true;
    if (!this.stationInfo.valid) {
      await this.cp.presentToast('Please provide all the required values!');
      await this.cp.dismissLoading();
      return false;
    } else {
      this.stationDetails = this.stationInfo.value
      console.log(this.stationDetails)
      await this.create(this.stationDetails);
    }
  }

  async create(stationDetails) {
    return this.apiTalk
      .postData(Config.API_URL + 'auth/signup', stationDetails)
      .then(async (res) => {
          if (res.status === 200) {
            await this.cp.dismissLoading();
            await this.cp.presentToast(res['json'].message);
            await this.navCtrl.navigateBack('login')
          } else {
            this.alreadyRegistered = true;
            await this.cp.dismissLoading();
            await this.cp.presentToast(res.message);
          }
        },
        (err) => {
          this.cp.dismissLoading();
        }
      );
  }

  async goToLogin(){
    await this.cp.presentLoading();
    await this.navCtrl.navigateBack('/login');
    await this.cp.dismissLoading();
  }
}
