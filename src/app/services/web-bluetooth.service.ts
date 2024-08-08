/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebBluetoothService {
  //https://developer.chrome.com/docs/capabilities/bluetooth
  constructor() { }
  //just google chrome over linux, not in debug
  requestAllDevices() {

    navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['generic_access']
    })
      .then(device => {
        console.log(device);
      })
      .catch(error => {
        console.error(error);
      });

  }


  requestDeviceByName() {
    navigator.bluetooth.requestDevice({
      filters: [{
        name: 'Redmi Note 7'
      }],
      optionalServices: ['generic_access']
    })
      .then(device => {
        console.log(device);

      })
      .catch(error => { console.error(error); });
  }

  connectDevice() {
    navigator.bluetooth.requestDevice({
      filters: [{
        name: 'Redmi Note 7'     //Mi Portable BT Speaker 16W
      }],
      optionalServices: ['generic_access']  //volume_control_service
    })
      .then(device => {
        console.log('Device : ' + JSON.stringify(device.id));
        return device.gatt.connect();
      })
      .then(server => {
        console.log('Server :' + JSON.stringify(server.connected));
        return server.getPrimaryServices;
      })
      .then(services => {
        console.log('Services :' + JSON.stringify(services.length));

      })
      .catch(error => { console.error(error); });
  }

  requestDeviceByServiceUUID(): Observable<BluetoothDevice> {

    return from(navigator.bluetooth.requestDevice({
      filters: [{
        services: ['00001105-0000-1000-8000-00805f9b34fb', '0000110a-0000-1000-8000-00805f9b34fb',
          '0000110c-0000-1000-8000-00805f9b34fb', '0000110d-0000-1000-8000-00805f9b34fb', '0000110e-0000-1000-8000-00805f9b34fb',
          '00001112-0000-1000-8000-00805f9b34fb', '00001115-0000-1000-8000-00805f9b34fb']
      }]
    }));

  }


  requestDeviceBatteryLevel() {

    navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
      .then(device => device.gatt.connect())
      .then(server => {
        return server.getPrimaryService('battery_service');
      })
      .then(service => {
        return service.getCharacteristic('battery_level');
      })
      .then(characteristic => {
        return characteristic.readValue();
      })
      .then(value => {
        console.log(`Battery percentage is ${value.getUint8(0)}`);
      })
      .catch(error => { console.error(error); });

  }

  //https://www.bluetooth.com/specifications/specs/vcs-1-0/
  volumeControlService() {
    //Mi Portable BT Speaker 16W
    navigator.bluetooth.requestDevice({ filters: [{ services: ['volume_control_service'] }] })
      .then(device => device.gatt.connect())
      .then(server => {
        return server.getPrimaryService('volume_control_service'); //?
      })
      .then(service => {
        return service.getCharacteristic('volume_setting');//would be
      })
      .then(characteristic => {
        return characteristic.writeValue(Buffer.from([127]));
      })
      .then(value => {
        console.log(`Volume percentage is 50%`);
      })
      .catch(error => { console.error(error); });


  }

}
