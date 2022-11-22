import { formatDate } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  info: any;
  bioPhoto: string;
  docPhoto: string;
  similarity: string;
  personalInfo: any;
  type: number;
  date: string;
  docFront: string;
  docBack: string;
  securityChecks: any;
  form: FormGroup;
  docType: string;
  processDate: string;
  processDateFormated: string;
  notUnderage: boolean;
  liveness: boolean;
  notBnWCopy: boolean;

  constructor(private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private router: Router,
              @Inject(LOCALE_ID) private locale: string) {
    this.info = JSON.parse(localStorage.getItem('info'));
    this.bioPhoto = 'data:image/jpeg;base64,' + this.info.biometrics.face.image;
    this.docPhoto = 'data:image/jpeg;base64,' + this.info.document.subject.photo;
    this.similarity = this.info.biometrics.face.similarityLevel;
    this.personalInfo = this.info.document.subject;
    this.type = this.info.idType;
    this.date = this.info.completion.date;
    this.docFront = 'data:image/jpeg;base64,' + this.info.document.front;
    this.docBack = 'data:image/jpeg;base64,' + this.info.document.back;
    this.securityChecks = this.info.securityChecks;
    this.buildForm();
  }

  photoNow() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.bioPhoto);
  }

  photoDocument() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.docPhoto);
  }

  documentFront() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.docFront);
  }

  documentBack() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.docBack);
  }

  private buildForm() {
    let fatherLastName = this.personalInfo.secondaryName.split(' ')[0];
    let motherLastName = this.personalInfo.secondaryName.split(' ')[1];
    let gender;
    if (this.personalInfo.sex === 'M') {
      gender = 'Masculino';
    } else {
      gender = 'Femenino'
    }
    this.form = this.formBuilder.group({
      nombre: [this.personalInfo.primaryName , [Validators.required]],
      apellidoPaterno: [fatherLastName , [Validators.required]],
      apellidoMaterno: [motherLastName , [Validators.required]],
      fechaDeNacimiento: [formatDate(this.personalInfo.birthDateTS, 'yyyy-MM-dd', this.locale) , [Validators.required]],
      gender: [gender, [Validators.required]],
      ineClv: [this.personalInfo.electorKey, [Validators.required]],
      curp: [this.personalInfo.personalNumber, [Validators.required]],
      address: [this.personalInfo.address, [Validators.required]]
    })
  }

  save(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      localStorage.setItem('data', JSON.stringify(value));
      let EidData = {
        'nivelParecido': this.similarity,
        'tipoDocumento': this.type.toString(),
        'fechaDeProceso': this.processDateFormated,
        'mayorDeEdad': this.securityChecks.notUnderage.passed ? 'true' : 'false',
        'copiaBN': this.securityChecks.notBWCopy.passed ? 'true' : 'false',
        'pruebaDeVida': this.securityChecks.liveness.passed ? 'true' : 'false',
        'imgRostro': this.info.biometrics.face.image,
        'imgRostroID': this.info.document.subject.photo,
        'imgIDFrontal': this.info.document.front,
        'imgIDTrasera': this.info.document.back,
      }
      localStorage.setItem('eid', JSON.stringify(EidData));
      this.router.navigateByUrl('onboarding/documentation/account');
    } else {
      this.form.markAllAsTouched();
    }
  }

  ngOnInit() {
    if (this.type === 189) {
      this.docType = 'INE/IFE'
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    this.processDate = new Date(this.date).toLocaleDateString('es-MX', options);
    this.processDateFormated = formatDate(this.date, 'yyyy-MM-dd', this.locale)
  }

}
