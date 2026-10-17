# Equipment

What we have today (October 2026). Prices in euro, including 21% VAT.

## Parts list

| Qty | Code | Part | Price each | Total |
|---|---|---|---|---|
| 1 | KW-3629 | BBC micro:bit V2.2 Go bundle with USB-C cable | 20,56 | 20,56 |
| 1 | KW-2752 | Kitronik Compact 16 Servo Driver Board for the BBC micro:bit | 13,90 | 13,90 |
| 2 | EF-09087 | Building Brick Motor (LEGO compatible) | 5,67 | 11,35 |
| 3 | | Servo SG90 (hobby micro servo) | | |
| 2 | KW-2640 | Servo extension cable, 30 cm | 1,56 | 3,12 |
| 1 | KW-1909 | PIR motion sensor | 3,62 | 3,62 |
| 1 | KW-1539 | 4x AA battery holder with on/off switch | 3,01 | 3,01 |
| 1 | JW-MF-10-15 | Jumper wires, 10 pieces, M/F, 15 cm | 2,17 | 2,17 |
| 1 | JW-MM-10-15 | Jumper wires, 10 pieces, M/M, 15 cm | 2,17 | 2,17 |
| 1 | JW-FF-10-15 | Jumper wires, 10 pieces, F/F, 15 cm | 2,17 | 2,17 |

Shipping was 4,22.

## What this means for the app

* **micro:bit V2.2.** Bluetooth, the speaker, the touch logo and the microphone are all available. The Go bundle also has a small 2x AAA battery pack for the micro:bit alone.
* **Servo board.** The Kitronik Compact 16 drives up to 16 servos. It talks to the micro:bit over I2C, so pins 0, 1 and 2 stay free for the PIR sensor. It has a MakeCode extension. The servos take their power from the board, not from the micro:bit.
* **Servos.** We have 5 in total: 3 SG90s and 2 Building Brick Motors. Check whether the Building Brick Motors are servos with a position (like the SG90, 180 degrees) or wheels that spin all the way around. This changes the app's controls: a slider for an angle, or forward, stop and back for speed.
* **Power.** Use the 4x AA holder to power the servo board. Check the board's maximum input voltage first. Four fresh alkaline AAs give about 6 V. Four rechargeable NiMH AAs give about 4.8 V, which is the safer choice.
* **PIR sensor.** Senses when someone moves nearby. It connects with jumper wires to a free pin, such as pin 1. Check the sensor's supply voltage, because some PIR modules need 5 V and the micro:bit gives 3 V.
* **Not on the list.** A way for the iPad to reach the micro:bit. Plan A is the free Bluefy browser app, so nothing extra is needed. See `IDEA.md`.
