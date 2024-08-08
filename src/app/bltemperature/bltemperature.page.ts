import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { BluetoothService } from '../services/bluetooth.service';
import { WebBluetoothService } from '../services/web-bluetooth.service';

@Component({
  selector: 'app-bltemperature',
  templateUrl: './bltemperature.page.html',
  styleUrls: ['./bltemperature.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class BltemperaturePage implements OnInit {

  constructor(private bltService: BluetoothService,
    private bltWebService: WebBluetoothService) { }

  ngOnInit() {
  }

  output: string;

  scanByName() {
    //this.bltService.starScan();
    this.bltWebService.requestDeviceByName();
  }

  scanAll() {
    //this.bltService.starScan();
    this.bltWebService.requestAllDevices();
  }

  scanByUUIID() {
    //this.bltService.starScan();
    this.bltWebService.requestDeviceByServiceUUID().subscribe(o => { console.log('id device: ' + o.id) });
  }

  stop() {
    this.bltService.stopScan();
  }

  connect() {
    //this.bltService.connect();
    this.bltWebService.connectDevice();
  }

  requestDeviceBatteryLevel() {
    //this.bltService.connect();
    this.bltWebService.requestDeviceBatteryLevel();
  }

  volumeLevel() {
    //this.bltService.connect();
    this.bltWebService.volumeControlService();
  }

}
