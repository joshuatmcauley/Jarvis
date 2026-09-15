# What to add next

Add **capability**, not boxes. The TL-SG108S + Pi 5 4 GB lab is enough to practise Linux, Docker, cabling, and documentation. VLANs belong in a simulator until you buy a managed switch on purpose.

## Do these before spending

1. Finish [bring-up.md](bring-up.md) and fill the IP table in [network.md](network.md).
2. DHCP reservation for the Pi on the BT Hub.
3. Find and record the Docker compose path. Back it up (`git` in a **private** repo, or a USB copy). **Strip secrets.**
4. If the Pi still boots from SD, copy important data off it. SD cards die after sitting in a drawer.
5. Label cables. Photograph the rack; drop a redacted photo in this folder later if you want.

## Cheap / already owned (do these)

| Add | Why | How |
|-----|-----|-----|
| Home Assistant (Docker on the Pi) **or** ESPHome | Uses the ESP32 + sensor kits you already bought | One temperature or PIR entity first. Do not import 37 sensors in a night. |
| Jarvis on autostart | You already have `setup_autostart.sh` | Only if the Elecrow is the kiosk |
| USB SSD for media / Docker volumes | 4 GB Pi + SD + Jellyfin is fragile | Move compose volumes onto SSD; keep OS on SD or boot from SSD |
| Ethernet test / re-terminate one lead | Helpdesk evidence | Continuity, then a photo in this repo (no house address in EXIF if you care) |
| Packet Tracer VLAN lab | Network skills the 108S cannot do | Write-up in Jarvis `it-path/labs/` when that kit is on `main` |

## Buy only with a reason

| Add | Buy when | Avoid if |
|-----|----------|----------|
| Small UPS (Pi + switch + Hub) | You have unclean shutdowns or flaky power | You have not backed up the SD yet |
| **Managed** 8-port (e.g. TL-SG108E / GS108Ev3 or better) | You want real 802.1Q between Pi subinterfaces and a second box | You only need more ports — then another unmanaged is fine |
| Extra Pi or a mini PC | You want Home Assistant **or** Jellyfin, not both on 4 GB | You have not measured RAM with `free -h` under load |
| USB NIC / second interface on Pi | You want the Pi to *route* a lab subnet | You are still learning `ip r` on one NIC |
| NAS / used SFF PC | Media library outgrew USB disks | Jellyfin is not even running |

Do not buy a rack full of Ubiquiti “because homelab YouTube.” A documented BT Hub + unmanaged switch + Pi beats an undocumented UniFi stack.

## Sensible target architecture (later)

```text
BT Hub (still the ISP NAT)
    │
    ├── home Wi-Fi (phones)
    └── Ethernet
            │
      [ managed switch ]  ← when purchased
            ├── VLAN 10 trusted (Pi SSH, HA)
            ├── VLAN 20 IoT (ESP32)
            └── VLAN 30 media (optional)
```

Until that switch exists, **do not pretend** the SG108S is doing VLANs. Linux bridges on the Pi and Packet Tracer are the honest story.

## Project ideas that grow *this* lab

Using gear you already have (ESP32, 433 MHz pair, sensors, P1S):

1. **Rack thermometer** — DHT/XHT11 on ESP32 → MQTT or HA. Graph it. That is monitoring.
2. **Link-check script** on the Pi — ping Hub + `1.1.1.1`, log failures. First “NOC” habit.
3. **One RF or IR control** only if you still care about the Energizer plugs / RX480E work; otherwise leave those branches alone.
4. **Print a cable-management comb / port numbers** for the Labrax rack so the next cold start is faster.

## GitHub after you add something

1. Update [inventory.md](inventory.md) and [network.md](network.md) in the same commit as the changelog line.
2. Copy the same files into [joshuatmcauley/homelab](https://github.com/joshuatmcauley/homelab) when you have write access there (this Cursor run can only push **Jarvis**).
3. Pin **Jarvis** and **homelab** on your GitHub profile so the network story is visible.
