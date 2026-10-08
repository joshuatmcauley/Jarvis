# Inventory

Split so the **rack** stays readable. Bench parts are summarised; the full electronics CSV lives on the Jarvis inventory branch if you still want every sensor.

## Rack / network (core)

| Item | Role | Notes |
|------|------|--------|
| BT Hub | ISP router | DHCP, NAT, Wi-Fi |
| BT Wi-Fi disk | Mesh / extender | Between Hub and switch in the last diagram |
| TP-Link TL-SG108S | Unmanaged 8-port GbE | No VLANs |
| Raspberry Pi 5 4 GB | Compute | Docker (Jun 2025), Jarvis app |
| Official-class 27 W USB-C PSU | Pi power | Do not substitute a weak charger |
| Labrax 3D-printed rack | Physical | Printed on Bambu Lab P1S |
| Ethernet patch leads | L1 | Label uplink vs Pi |

## Pi extras

| Item | Role |
|------|------|
| Elecrow 7-inch display | Local console / Jarvis GUI |
| Raspberry Pi Camera Module 3 | Planned / camera |
| Raspberry Pi Camera Module 2 | Spare / alternate (from 2026 purchases) |

## Microcontrollers on the lab (not always racked)

| Item | Role |
|------|------|
| Keyestudio ESP32 Plus | Main ESP32 |
| ESP32 terminal / breakout | Accessories |
| Arduino UNO R4 | Separate from ESP32 |

## Bench (makerspace, not the LAN)

Owned and useful for add-ons, not required to bring the network up:

- Elegoo 37-sensor kit, Keyestudio smart-home kit (PIR, RFID, DHT, servos, LCD, gas, etc.)
- QIACHIP 433 MHz TX/RX (TX118SA / RX480E) and antennas
- L298N motor driver, 5 V USB fans, breadboards, PSU, jumper/hookup wire, resistor kit, XL830L multimeter
- Bambu Lab P1S (+ spare chamber light)

Do not hang the printer’s LAN identity off this file unless it actually sits on the switch.

## Software last seen on the Pi (2 Jun 2025)

- Raspberry Pi OS (confirm version on bring-up: `cat /etc/os-release`)
- Docker
- Jellyfin, Prowlarr, qBittorrent, Radarr, Sonarr

Tick or strike these in [changelog.md](changelog.md) when you verify they still exist.

## Explicitly not in this lab

- No managed switch
- No dedicated NAS
- No UPS (add when you care about unclean Pi shutdowns)
- No hypervisor host (Proxmox etc.) — the Pi is the server
