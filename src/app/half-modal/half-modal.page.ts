import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config } from '../configuration/config';
import { ComponentService } from '../services/components/component.service';
import { ApiTalkService } from '../services/api-talk/api-talk.service';
        
@Component({
  selector: 'app-half-modal',
  templateUrl: './half-modal.page.html',
  styleUrls: ['./half-modal.page.scss'],
})
export class HalfModalPage implements OnInit {
  @Input() rate
  ionicForm: FormGroup;
  isSubmitted = false;
  stations= [];

  constructor(public modalController: ModalController,
    public formBuilder: FormBuilder,
    public cp: ComponentService) {

     }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      rate: [this.rate, [Validators.required]],
    });
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm() {
    this.cp.presentLoading();
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      this.cp.presentToast('Please provide the required values!');
      this.cp.dismissLoading();
      return false;
    }
     else {
      this.dismiss();
      this.cp.dismissLoading();
    }
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
      values: this.ionicForm.value,
    });
  }
  close() {
    this.modalController.dismiss(false);
  }
}
