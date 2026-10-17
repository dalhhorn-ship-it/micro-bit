# Equipment

Everything we have, grouped by the date it arrived. Prices in euro, including 21% VAT. Add new parts as a new dated section at the bottom.

## 2026-10-17

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

## 2026-10-20

| Qty | Code | Part | Price each | Total |
|---|---|---|---|---|
| 1 | EF-11089 | ELECFREAKS micro:bit case, transparent | 3,25 | 3,25 |
| 1 | EF-10155 | 360 degrees Building Blocks Servo (LEGO compatible) | 11,48 | 11,48 |
| 2 | EF-09085 | 9g 270 degrees Building Blocks Servo (LEGO compatible) | 7,61 | 15,22 |
| 1 | | XUHN 213 piece Technic parts set (gears, axles, pin connectors), LEGO Technic compatible | 23,99 | 23,99 |

## Servo overview

We have 8 servos or motors. The servo board has 16 channels, so they all fit.

| Qty | Part | Moves how | App control |
|---|---|---|---|
| 3 | SG90 | To an angle, 0 to 180 degrees | Slider |
| 2 | 9g 270 degrees Building Blocks Servo | To an angle, 0 to 270 degrees | Slider |
| 1 | 360 degrees Building Blocks Servo | Spins all the way round, like a wheel. You set speed and direction, not an angle. | Forward, stop, back (or a speed slider centered on stop) |
| 2 | Building Brick Motor (EF-09087) | Still to check: angle or spin | |

The Building Blocks servos fit LEGO Technic holes and axles directly, so they work with the Technic parts set. The SG90s need a bracket or tape.

## What this means for the app

* **micro:bit V2.2.** Bluetooth, the speaker, the touch logo and the microphone are all available. The Go bundle also has a small 2x AAA battery pack for the micro:bit alone. The case protects it while it is built into models.
* **Servo board.** The Kitronik Compact 16 drives up to 16 servos. It talks to the micro:bit over I2C, so pins 0, 1 and 2 stay free for the PIR sensor. It has a MakeCode extension. The servos take their power from the board, not from the micro:bit.
* **Two kinds of control.** Angle servos get a slider. The 360 degrees servo gets speed and direction. The app needs to know which kind sits on each channel, so make that a simple setting.
* **Power.** Use the 4x AA holder to power the servo board. Check the board's maximum input voltage first. Four fresh alkaline AAs give about 6 V. Four rechargeable NiMH AAs give about 4.8 V, which is the safer choice. Many servos moving at once can draw a lot of current, so fresh batteries matter.
* **PIR sensor.** Senses when someone moves nearby. It connects with jumper wires to a free pin, such as pin 1. Check the sensor's supply voltage, because some PIR modules need 5 V and the micro:bit gives 3 V.
* **Not on the list.** A way for the iPad to reach the micro:bit. Plan A is the free Bluefy browser app, so nothing extra is needed. See `IDEA.md`.
