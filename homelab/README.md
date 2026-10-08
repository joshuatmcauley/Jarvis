# Homelab and home network

Personal rack in Ballymoney: **Raspberry Pi 5 (4 GB)**, **TP-Link TL-SG108S**, and **ESP32** on a 3D-printed Labrax rack, sitting behind a **BT Hub** and **BT Wi-Fi disk**.

This folder is the living write-up. Hardware-only notes also live in the public repo [joshuatmcauley/homelab](https://github.com/joshuatmcauley/homelab). Jarvis (this repo) holds the Pi app and lab write-ups. **No Wi-Fi passwords, BT admin logins, API keys, or public IPs belong in git.**

## Start here (powered on after months)

1. [bring-up.md](bring-up.md) — physical power-on, then Pi, then Docker.
2. [network.md](network.md) — what is plugged into what, and what the unmanaged switch cannot do.
3. [inventory.md](inventory.md) — kit on the rack vs kit on the electronics bench.
4. [expand.md](expand.md) — what to add next without buying a data centre.
5. [changelog.md](changelog.md) — dated notes of what you actually changed.

## Topology (as last documented)

```text
Internet
    │
[ BT Hub ]  ← ISP router / Wi-Fi / DHCP / NAT
    │
[ BT Wi-Fi disk ]  ← mesh / extender
    │
[ TP-Link TL-SG108S ]  ← unmanaged 8-port gigabit (no VLANs)
    │
[ Raspberry Pi 5 4GB ]  ← Docker / Jarvis / (optional) media stack
    │
[ ESP32 ]  ← usually on Wi-Fi, not a switch port
```

Fill real hostnames and **private** IPs in [network.md](network.md) once the Pi is back online. Truncate MAC addresses if you screenshot.

## Two GitHub places

| Repo | What belongs there |
|------|-------------------|
| [Jarvis](https://github.com/joshuatmcauley/Jarvis) | This folder, the desktop app, ESP32 sketches, IT-path labs |
| [homelab](https://github.com/joshuatmcauley/homelab) | Same hardware story, shorter. Copy updated files across when you next open that repo |

After a bring-up session, commit a changelog line the same night. Recruiters and future-you both care that the diagram matches the cables.
