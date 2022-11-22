import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../../../validators/must-match.validator';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  form: FormGroup;
  existEmail: boolean = false;
  assetId: string;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.apiService.get('https://sodev.anzen.com.mx:9000/apis/blockchain/kyc/org1/clients').then(resp=>{
      let length = resp.clients.length + 1;
      this.assetId = 'asset' + length.toString()
    });
   }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        telefono: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
        pswrd: ['', [Validators.required]],
        pswrd2: ['', [Validators.required]],
        termsConditions: [false, [Validators.requiredTrue]],
        contract: [false, [Validators.requiredTrue]]
      },
      {
        validator: MustMatch("pswrd", "pswrd2")
      }
    )
  }

  save(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      const data = JSON.parse(localStorage.getItem('data'));
      const eid = JSON.parse(localStorage.getItem('eid'));
      // let formData = {
      //   "assetID": 'asset10',
      //   "telefono": data.telefono,
      //   "email": value.email,
      //   "pswrd": value.pswrd,
      //   "nombre": data.nombre,
      //   "apellidoPaterno": data.apellidoPaterno ,
      //   "apellidoMaterno": data.apellidoMaterno ,
      //   "curp": 'AAAA000000AAAAAA00',
      //   "ineClv": data.ineClv,
      //   "anioDeRegistro": '0000',
      //   "anioDeEmision": '0000',
      //   "vigencia": '0000',
      //   "calle": 'Calle',
      //   "numero": 1,
      //   "colonia": 'Colonia',
      //   "localidad": 'Localidad',
      //   "seccion": 'Seccion',
      //   "municipio": 'Municipio',
      //   "estado": 'Estado',
      //   "codigoPostal": data.codigoPostal,
      //   "ocr": 'OCR',
      //   "idCiudadano": '0000000000',
      //   "fechaDeNacimiento": data.fechaDeNacimiento ,
      //   "nacionalidad": 'Mexicano',
      //   "paisDeResidencia": 'México',
      //   "tipoDeActividad": 'Nivel 1'
      // }
      let address = data.address.replace(/(\r\n|\n|\r)/gm," ");
      let formData = {
        "assetID": this.assetId,
        "telefono":  value.telefono,
        "email":  value.email,
        "pswrd": value.pswrd,
        "nombre": data.nombre,
        "apellidoPaterno": data.apellidoPaterno,
        "apellidoMaterno": data.apellidoMaterno,
        "curp": data.curp,
        "ineClv": data.ineClv,
        "anioDeRegistro": "0000",
        "anioDeEmision": "0000",
        "vigencia": "0000",
        "calle": "Calle",
        "numero": 1,
        "colonia": "Colonia",
        "localidad": "Localidad",
        "seccion": "Seccion",
        "municipio": "Municipio",
        "estado": "Estado",
        "codigoPostal": "00000",
        "ocr": "OCR",
        "idCiudadano": "7823tygdbwh",
        "fechaDeNacimiento": data.fechaDeNacimiento,
        "nacionalidad":"Mexicana",
        "paisDeResidencia": "Mexico",
        "tipoDeActividad": "Nivel 1",
        "nivelParecido": eid.nivelParecido,
        "domicilio": address,
        "tipoDocumento": eid.tipoDocumento,
        "fechaDeProceso": eid.fechaDeProceso,
        "genero": data.gender,
        "mayorDeEdad": eid.mayorDeEdad,
        "copiaBN": eid.copiaBN,
        "pruebaDeVida": eid.pruebaDeVida,
        "imgRostro": eid.imgRostro,
        "imgRostroID": eid.imgRostroID,
        "imgIDFrontal": eid.imgIDFrontal,
        "imgIDTrasera": eid.imgIDTrasera
      }
      console.log(formData);
      this.apiService.post('https://sodev.anzen.com.mx:9000/otpservice/otp', {'mail': value.email, 'service': 'blockchain-kyc'}).then(resp=>{
        localStorage.setItem('data', JSON.stringify(formData));
        localStorage.setItem('clientMail', value.email);
        this.router.navigateByUrl('onboarding/documentation/otp');
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
