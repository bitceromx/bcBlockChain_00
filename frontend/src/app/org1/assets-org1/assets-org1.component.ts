import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-assets-org1',
  templateUrl: './assets-org1.component.html',
  styleUrls: ['./assets-org1.component.scss']
})
export class AssetsOrg1Component implements OnInit {

  clients: any;

  constructor(private apiService: ApiService) {
    this.getClients();
  }

  ngOnInit(): void {
  }

  getClients() {
    this.apiService.get('https://sodev.anzen.com.mx:9000/apis/blockchain/kyc/org1/clients').then(resp=>{
      this.clients = resp.clients;
    });
  }

}
