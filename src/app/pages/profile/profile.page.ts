import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config } from 'src/app/configuration/config';
import { ApiTalkService } from 'src/app/services/api-talk/api-talk.service';
import { ComponentService } from 'src/app/services/components/component.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  ionicForm: FormGroup;
  isSubmitted = false;
  personalDetails;
  isenabled = true;
  editEnabled = true;
  
  constructor(
    public formBuilder: FormBuilder,
    public cp: ComponentService,
    private apiTalk: ApiTalkService
  ) {
    this.ionicForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      representative_name: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        '',
        [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')],
      ],
      address: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      GST: ['', Validators.compose([
        Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
        Validators.required,
      ]),],
      dealer_code: ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(7),
        Validators.required,
      ]),],
    });
   }

  async ionViewDidEnter() {
    await this.getPersonalDetail();
  }

  getPersonalDetail() {
    return this.apiTalk.getData(Config.API_URL + 'profile').then((res) => {
      this.personalDetails = res['json'];
      console.log(this.personalDetails)
      this.ionicForm=this.formBuilder.group({
        name: [
          this.personalDetails?.name,
          [Validators.required, Validators.minLength(2)],
        ],
        representative_name: [
          this.personalDetails?.representative_name,
          [Validators.required, Validators.minLength(2)],
        ],
        email: [
          this.personalDetails?.email,
          [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')],
        ],
        address: [
          this.personalDetails?.address,
          [Validators.required, Validators.minLength(2)],
        ],
        GST: [this.personalDetails?.GST, Validators.compose([
          Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
          Validators.required,
        ]),],
        dealer_code: [this.personalDetails?.dealer_code, Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(7),
          Validators.required,
        ]),],
      });
    });
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  edit() {
    this.cp.presentLoading();
    if (this.isenabled == true) {
      this.isenabled = false;
      this.editEnabled = false;
      this.cp.dismissLoading();
    }
  }
  cancel() {
    this.cp.presentLoading();
    this.editEnabled = true;
    this.isenabled = true;
    this.cp.dismissLoading();
  }

  submitForm(){
    console.log(this.ionicForm.value);
    this.cp.presentLoading();
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      this.cp.presentToast('Please provide all the required values!');
      this.cp.dismissLoading();
      return false;
    } else {
      this.updateProfile();
    }  
  }

  updateProfile() {
    return this.apiTalk.patchData(Config.API_URL + 'profile', this.ionicForm.value).then(
      (res) => {
        console.log(res['json'])
        this.cp.presentToast(res['json'].message);
        this.editEnabled = true;
        this.isenabled = true;
        this.cp.dismissLoading();
      },
      (err) => {
        this.cp.dismissLoading();
      }
    );
  }
}
