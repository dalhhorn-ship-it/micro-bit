// Space Bunnies: the micro:bit side.
// Listens for commands from the iPad app over Bluetooth and answers "OK".
// Keep this in sync with app/src/protocol.js.
//
// In MakeCode (makecode.microbit.org):
// 1. New project, switch to JavaScript, paste this file.
// 2. Extensions: add "bluetooth" (accept removing radio) and
//    "kitronik-i2c-16-servo".
// 3. Project settings (gear icon): choose "No Pairing Required".
// 4. Download to the micro:bit.

const SERVOS = [
    kitronik_i2c_16_servo.Servos.Servo1,
    kitronik_i2c_16_servo.Servos.Servo2,
    kitronik_i2c_16_servo.Servos.Servo3
]

function showRows(parts: string[]) {
    for (let y = 0; y < 5; y++) {
        const row = parseInt(parts[y + 1])
        for (let x = 0; x < 5; x++) {
            if ((row >> (4 - x)) & 1) {
                led.plot(x, y)
            } else {
                led.unplot(x, y)
            }
        }
    }
}

bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Rabbit)
})

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    const line = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    const parts = line.split(",")
    const cmd = parts[0]
    if (cmd == "S") {
        const ch = parseInt(parts[1])
        if (ch >= 1 && ch <= SERVOS.length) {
            kitronik_i2c_16_servo.servoWrite(SERVOS[ch - 1], parseInt(parts[2]))
        }
    } else if (cmd == "T") {
        basic.showString(line.substr(2), 100)
    } else if (cmd == "I") {
        showRows(parts)
    } else if (cmd == "N") {
        music.playTone(parseInt(parts[1]), parseInt(parts[2]))
    } else if (cmd == "C") {
        basic.clearScreen()
    }
    bluetooth.uartWriteLine("OK")
})

input.onButtonPressed(Button.A, function () {
    bluetooth.uartWriteLine("A")
})

input.onButtonPressed(Button.B, function () {
    bluetooth.uartWriteLine("B")
})

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    bluetooth.uartWriteLine("L")
})

bluetooth.startUartService()
basic.showIcon(IconNames.Rabbit)
