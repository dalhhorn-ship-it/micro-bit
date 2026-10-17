import { BaseConnection } from './base.js';

// The micro:bit Bluetooth UART service. Note the micro:bit names TX and RX
// from its own side: it sends on 6e400002 and listens on 6e400003.
const UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const FROM_MICROBIT = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const TO_MICROBIT = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const CHUNK = 20;

export const bluetoothAvailable = () => typeof navigator !== 'undefined' && !!navigator.bluetooth;

export class BluetoothConnection extends BaseConnection {
  async connect() {
    if (!bluetoothAvailable()) {
      throw new Error('This browser has no Bluetooth. On iPad, open the app in the Bluefy browser.');
    }
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'BBC micro:bit' }],
      optionalServices: [UART_SERVICE],
    });
    this.device.addEventListener('gattserverdisconnected', () => this.setConnected(false));
    const server = await this.device.gatt.connect();
    const service = await server.getPrimaryService(UART_SERVICE);
    this.rx = await service.getCharacteristic(TO_MICROBIT);
    const tx = await service.getCharacteristic(FROM_MICROBIT);
    const decoder = new TextDecoder();
    tx.addEventListener('characteristicvaluechanged', (e) => this.receive(decoder.decode(e.target.value)));
    await tx.startNotifications();
    this.setConnected(true);
  }

  async disconnect() {
    this.device?.gatt?.disconnect();
    this.setConnected(false);
  }

  async write(text) {
    const bytes = new TextEncoder().encode(text);
    for (let i = 0; i < bytes.length; i += CHUNK) {
      await this.rx.writeValue(bytes.slice(i, i + CHUNK));
    }
  }
}
