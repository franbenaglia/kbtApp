import { Injectable } from '@angular/core';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
//https://github.com/aBoyCanDream/ESP32-Capacitor-BLE-Tutorial/blob/main/src/js/main.js

//https://developer.chrome.com/docs/capabilities/bluetooth

//https://github.com/WebBluetoothCG/web-bluetooth/blob/main/implementation-status.md  :
//  Android WebView: Will be supported in the future
//  In Android, Chrome OS, Mac and Windows, the GATT Communication API is shipped without any flag.
// web: Linux is partially implemented and not supported. The chrome://flags/#enable-experimental-web-platform-features
// flag must be enabled.
// web: Linux firefox not supported, chrome partially, android webview not supported

// generic_access, generic_attribute : redminote7
//https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html?service=generic_access

//chrome://bluetooth-internals/#devices     nro de servicios de cada dispositivo conectado, al googlear son drivers del
//bluetooth conectado

type Funct = () => void;

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  isLocationEnabled: boolean = false;
  isBLEEnabled: boolean = false;
  ble: boolean = false;
  deviceObject: BleDevice;

  constructor() {

  }

  starScan() {
    this.initialize(this.startScanning);
  }

  stopScan() {
    this.initialize(this.stopScanning);
  }

  private async initialize(fun: Funct): Promise<void> {

    if (Capacitor.getPlatform() == 'android') {
      //Reports whether Location Services are enabled on this device. Only available on Android.
      this.isLocationEnabled = await BleClient.isLocationEnabled();
    } else {
      this.isLocationEnabled = true;
    }

    await BleClient.initialize({ androidNeverForLocation: true });

    this.isBLEEnabled = await BleClient.isEnabled();

    if (this.isBLEEnabled && this.isLocationEnabled) {
      this.ble = true;
      fun();
    }

  }

  private startScanning(): void {
    BleClient.requestLEScan({ 
      allowDuplicates: false,
      services: ['00001105-0000-1000-8000-00805f9b34fb']      //chrome://bluetooth-internals/#devices , earphones bt redminote 
    },
       (res1) => {
      console.log('Device found', res1)
    });
  }

  private stopScanning(): void {

    setTimeout(async () => {
      await BleClient.stopLEScan();
      console.log('stopped scanning');
    }, 10000);

  }

  connect() {
    this.initialize(this._connect);
  }

  private async _connect() {

    const device = await BleClient.requestDevice({

    });

    await BleClient.connect(device.deviceId, (deviceId) => this.onDisconnect(deviceId));
    console.log('connected to device', device);
    this.deviceObject = device;


  }

  private onDisconnect(deviceId: string) {
    console.log(`device ${deviceId} disconnected`);
  }

  async startListen() {
    await BleClient.startNotifications(
      this.deviceObject.deviceId,
      "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
      "beb5483e-36e1-4688-b7f5-ea07361b26a8",
      (value: DataView) => {
        console.log('char data received: ', value.getUint32(0), true);

      }
    )
  }

  async writeData(...data: number[]) {
    const bufferSize = 20;
    const buffer = new ArrayBuffer(bufferSize);
    const dataView = new DataView(buffer);

    for (let d of data) {
      dataView.setUint8(0, d);
    }

    await BleClient.write(
      this.deviceObject.deviceId,
      "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
      "e3223119-9445-4e96-a4a1-85358c4046a2",
      dataView
    )
  }

}
