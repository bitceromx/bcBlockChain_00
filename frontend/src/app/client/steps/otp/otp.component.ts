import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OtpComponent implements OnInit {

  form: FormGroup;
  client: boolean;
  error: boolean;
  otp: string;
  mail: string;
  message: string;
  existEmail: boolean;
  existPhone: boolean;
  existClient: boolean;

  @ViewChild('number1') number1: ElementRef;
  @ViewChild('number2') number2: ElementRef;
  @ViewChild('number3') number3: ElementRef;
  @ViewChild('number4') number4: ElementRef;
  @ViewChild('submitButton') button: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router,
              private element: ElementRef) {
    this.buildForm();
    this.error = false;
    this.message = 'A ocurrido un error, intentalo nuevamente';
    this.existEmail = false;
    this.existPhone = false;
    this.existClient = false;
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      number1: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      number2: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      number3: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      number4: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    })
  }

  back(event: Event) {
    event.preventDefault();
    if (localStorage.getItem('existClient') != null) {
      this.router.navigateByUrl('/onboarding/documentation/start')
    } else {
      this.router.navigateByUrl('/onboarding/documentation/video-info')
    }
  }

  save(event: Event) {
    event.preventDefault();
    this.mail = localStorage.getItem('clientMail');
    if (this.form.valid) {
      const value = this.form.value;
      this.otp = value.number1 + value.number2 + value.number3 + value.number4;
      this.apiService.post('https://sodev.anzen.com.mx:9000/otpservice/otp', {'mail': this.mail, 'code': this.otp, 'service': 'blockchain-kyc'}).then(resp=>{
        console.log(resp);
        if (resp.message === 'Código no expedio o previamente utilizado..') {
          this.error = true
          this.message = 'El código que ingresaste es inválido. Verifica que esté escrito correctamente';
        } else {
          if (localStorage.getItem('existClient') != null) {
            let data = {'assetID': localStorage.getItem('id'), 'org1': 'Org1', 'org2': 'Org2'};
            this.apiService.post('https://sodev.anzen.com.mx:9000/apis/blockchain/kyc/org2/clients/transfer', data).then(res => {
              this.apiService.get('https://sodev.anzen.com.mx:9000/apis/blockchain/kyc/org1/clients/'+localStorage.getItem('ineKey')).then(res=>{
                localStorage.setItem('client', JSON.stringify(res.asset));
                this.router.navigateByUrl('/onboarding/documentation/data');
              });
            })
          } else {
            let formData = JSON.parse(localStorage.getItem('data'));
            this.apiService.post('https://sodev.anzen.com.mx:9000/apis/blockchain/kyc/org1/clients', formData).then(resp => {
              if (resp.message === 'Código no expedio o previamente utilizado..') {
                this.error = true
                this.message = 'El código que ingresaste es inválido. Verifica que esté escrito correctamente';
              } else {
                this.router.navigateByUrl('/onboarding/documentation/finish');
              }
            }).catch(err => {
                console.log(err);
                if (err.message == 'El email que usaste fue registrado por otro cliente') {
                  this.existEmail = true;
                }
                else if(err.message == 'El telefono que usaste fue registrado por otro cliente') {
                  this.existPhone = true;
                }
                else if(err.message == 'La clave de ine que usaste fue registrada por otro cliente') {
                  this.existClient = true;
                }
            });
          }
        }
      });
    } else {
      this.error = true;
    }
  }

  onKeyUp(event: Event) {
    event.preventDefault();
    if (event.target === this.number1.nativeElement) {
      if (this.number1.nativeElement.value.length === 1) {
        if (this.form.get('number1').errors) {
          this.error = true
          this.message = 'El código debe contener solo números';
        } else {
          this.error = false
          this.number2.nativeElement.focus();
        }
      }
    } else if(event.target === this.number2.nativeElement) {
      if (this.number2.nativeElement.value.length === 1) {
        if (this.form.get('number2').errors) {
          this.error = true
          this.message = 'El código debe contener solo números';
        } else {
          this.error = false
          this.number3.nativeElement.focus();
        }
      }
    } else if(event.target === this.number3.nativeElement) {
      if (this.number3.nativeElement.value.length === 1) {
        if (this.form.get('number3').errors) {
          this.error = true
          this.message = 'El código debe contener solo números';
        } else {
          this.error = false
          this.number4.nativeElement.focus();
        }
      }
    } else if(event.target === this.number4.nativeElement) {
      if (this.number4.nativeElement.value.length === 1) {
        if (this.form.get('number4').errors) {
          this.error = true
          this.message = 'El código debe contener solo números';
        } else {
          this.error = false
          this.button.nativeElement.focus();
        }
      }
    }
  }
}
