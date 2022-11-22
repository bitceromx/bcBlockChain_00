import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  clients: any = [];

  constructor(private apiService: ApiService) {
    this.getClients();
  }

  ngOnInit(): void {
  }

  getClients() {
    this.apiService.get('https://sodev.anzen.com.mx:9000/apis/blockchain/kyc/org2/clients').then(resp=>{
      this.clients = resp.clients;
    });
  }

}
