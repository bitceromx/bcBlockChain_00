import { Component, OnInit, ElementRef, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  client: any;
  error: boolean;
  existPhone: boolean;
  info: any;
  date: string;

  @ViewChild('telefono') telefono: ElementRef;
  @ViewChild('nombre') nombre: ElementRef;
  @ViewChild('apellidoPaterno') apellidoPaterno: ElementRef;
  @ViewChild('apellidoMaterno') apellidoMaterno: ElementRef;
  @ViewChild('fechaDeNacimiento') fechaDeNacimiento: ElementRef;
  @ViewChild('codigoPostal') codigoPostal: ElementRef;
  @ViewChildren('telefono') tel: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private element: ElementRef,
              private sanitizer: DomSanitizer,
              private router: Router) {
    this.error = false;
    this.existPhone = false;
    if (localStorage.getItem('client') != null) {
      this.client = JSON.parse(localStorage.getItem('client'));
      console.log(this.client);
      // this.setValues(this.client);
    }
    console.log(localStorage.getItem('info'));
    if (localStorage.getItem('info') != null) {
      this.info = JSON.parse(localStorage.getItem('info'));
    }
    this.buildForm();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (localStorage.getItem('client') != null) {
      let elements = this.element.nativeElement.getElementsByClassName('ad-form-field');
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('ad-form-field-label-float')
      }
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      telefono: [this.client.telefono, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      nombre: [this.client.nombre , [Validators.required]],
      apellidoPaterno: [this.client.apellidoPaterno , [Validators.required]],
      apellidoMaterno: [this.client.apellidoMaterno , [Validators.required]],
      fechaDeNacimiento: [this.client.fechaDeNacimiento , [Validators.required]],
      ineClv: [this.client.ineClv, [Validators.required]],
      curp: [this.client.curp, [Validators.required]],
      domicilio: [this.client.domicilio, [Validators.required]],
      polityPrivacy: [false, [Validators.requiredTrue]],
      personalData: [false, [Validators.requiredTrue]],
    })
  }

  photoNow() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.client.imgRostro);
  }

  save(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      if (localStorage.getItem('existClient') != null) {
        const birthday = (value.fechaDeNacimiento).split('-');
        const newBirthday = birthday[2]+'-'+birthday[1]+'-'+birthday[0];

        // let formData = {
        //   "telefono": value.telefono,
        //   "nombre": value.nombre,
        //   "apellidoPaterno": value.apellidoPaterno ,
        //   "apellidoMaterno": value.apellidoMaterno ,
        //   "fechaDeNacimiento": newBirthday ,
        //   "codigoPostal": value.codigoPostal,
        //   "assetID": (localStorage.getItem('client') != null) ? this.client.assetID : 'asset05',
        //   // "assetID": 'asset04',
        //   "email": (localStorage.getItem('client') != null) ? this.client.email : 'ebernal@anzen.com.mx',
        //   "pswrd": (localStorage.getItem('client') != null) ? this.client.pswrd : 'password',
        //   "curp": (localStorage.getItem('client') != null) ? this.client.curp : 'AAAA000000AAAAAA00',
        //   "ineClv": (localStorage.getItem('client') != null) ? this.client.ineClv : '00000044',
        //   "anioDeRegistro": (localStorage.getItem('client') != null) ? this.client.anioDeRegistro : '0000',
        //   "anioDeEmision": (localStorage.getItem('client') != null) ? this.client.anioDeEmision : '0000',
        //   "vigencia": (localStorage.getItem('client') != null) ? this.client.vigencia : '0000',
        //   "calle": (localStorage.getItem('client') != null) ? this.client.calle : 'Calle',
        //   "numero": (localStorage.getItem('client') != null) ? this.client.numero : '0',
        //   "colonia": (localStorage.getItem('client') != null) ? this.client.colonia : 'Colonia',
        //   "localidad": (localStorage.getItem('client') != null) ? this.client.localidad : 'Localidad',
        //   "seccion": (localStorage.getItem('client') != null) ? this.client.seccion : 'Seccion',
        //   "municipio": (localStorage.getItem('client') != null) ? this.client.municipio : 'Municipio',
        //   "estado": (localStorage.getItem('client') != null) ? this.client.estado : 'Estado',
        //   "ocr": (localStorage.getItem('client') != null) ? this.client.ocr : 'OCR',
        //   "idCiudadano": (localStorage.getItem('client') != null) ? this.client.idCiudadano : '0000000000',
        //   "nacionalidad": (localStorage.getItem('client') != null) ? this.client.nacionalidad : 'Mexicano',
        //   "paisDeResidencia": (localStorage.getItem('client') != null) ? this.client.paisDeResidencia : 'México',
        //   "tipoDeActividad": (localStorage.getItem('client') != null) ? this.client.tipoDeActividad : 'Nivel 1'
        // }

        let formData = {
          "assetID": this.client.assetID,
          "telefono": value.telefono,
          "email": this.client.email,
          "pswrd": this.client,
          "nombre": value.nombre,
          "apellidoPaterno": value.apellidoPaterno,
          "apellidoMaterno": value.apellidoMaterno,
          "curp": value.curp,
          "ineClv": value.ineClv,
          "anioDeRegistro": this.client.anioDeRegistro,
          "anioDeEmision": this.client.anioDeEmision,
          "vigencia": this.client.vigencia,
          "calle": this.client.calle,
          "numero": this.client.numero,
          "colonia": this.client.colonia,
          "localidad": this.client.localidad,
          "seccion": this.client.seccion,
          "municipio": this.client.municipio,
          "estado": this.client.estado,
          "codigoPostal": this.client.codigoPostal,
          "ocr": this.client.ocr,
          "idCiudadano": this.client.idCiudadano,
          "fechaDeNacimiento": newBirthday,
          "nacionalidad": this.client.nacionalidad,
          "paisDeResidencia": this.client.paisDeResidencia,
          "tipoDeActividad": this.client.tipoDeActividad,
          "domicilio": value.domicilio
        }

        this.apiService.put('https://sodev.anzen.com.mx:9000/apis/blockchain/kyc/org2/clients', formData).then(resp => {
          console.log(resp);
          this.router.navigateByUrl('onboarding/documentation/finish');
        });
      } else {
        localStorage.setItem('data', JSON.stringify(value));
        this.router.navigateByUrl('onboarding/documentation/account');
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
