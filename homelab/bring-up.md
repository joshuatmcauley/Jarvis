# Cold start after the lab has been off

Do this in order. Stop if something smells hot, clicks, or the Pi SD/NVMe will not boot — that is a hardware problem, not a Docker problem.

## 0. Safety

- One wall socket or a known-good extension. Do not daisy-chain cheap strips.
- Pi 5 wants a **5 V / 5 A** USB-C PSU (27 W). A phone charger will throttle or fail to boot.
- The TL-SG108S is passive cooling. Give it air; do not bury it under the 3D printer.
- If you run a bench PSU (Nankadf) for ESP32 work, keep it **off** until the network is up. Wrong voltage on a 3.3 V board is a new project.

## 1. Cables before power

Walk the last known path (see [network.md](network.md)):

1. BT Hub WAN light / fibre or phone-line status as you normally have it.
2. Ethernet from Hub **LAN** → BT Wi-Fi disk (if that is still how the mesh is fed).
3. Ethernet from disk or Hub → **TL-SG108S** uplink (pick one port and label it `UPLINK` with tape).
4. Ethernet from switch → Pi 5 (use the Pi Ethernet jack, not a flaky USB adapter).
5. Display (Elecrow 7-inch if you still use it) and keyboard only if you need a local console. SSH is enough once you know the IP.

Label both ends of those three Ethernet runs if they are not labelled yet. That is a real technician task, not busywork.

## 2. Power on (bottom of the stack first)

| Order | Device | Healthy look |
|-------|--------|----------------|
| 1 | BT Hub | Internet / broadband LED steady as usual for your line |
| 2 | BT Wi-Fi disk | Linked to the Hub, not looping (one uplink only) |
| 3 | TL-SG108S | Power LED on; **link/activity** on uplink and Pi ports |
| 4 | Raspberry Pi 5 | Green ACT LED activity; display or SSH within a couple of minutes |
| 5 | ESP32 / USB gadgets | Only after the Pi has an address |

If the switch has power but **no** link lights on the Pi port: reseat the cable, try another switch port, try a known-good patch lead. Unmanaged switches have no config to “restore.”

## 3. Get onto the Pi

From a laptop on the same BT Wi-Fi (or a docked Ethernet):

```bash
# Find the Pi. Hostname is often raspberrypi unless you set one.
ping -c 2 raspberrypi.local
# If mDNS fails, check the BT Hub device list for "raspberrypi" / "Jarvis"
```

Then:

```bash
ssh USER@PI_IP
```

Replace `USER` (often `josh` or `pi`) and `PI_IP` once you write them in [network.md](network.md).

If SSH is refused:

- Local keyboard + Elecrow: log in on the console.
- Confirm Ethernet: `ip a` (look for `eth0` or `end0` with an `inet` address).
- Confirm default route: `ip r`.
- Confirm DNS: `ping -c 2 1.1.1.1` then `ping -c 2 github.com`.

**Do not paste Hub admin passwords into this repo.** If DHCP gave the Pi a new address after months off, set a **DHCP reservation** on the Hub for the Pi’s MAC so the next cold start is boring.

## 4. First commands on a stale Pi

```bash
date                                    # wrong year → NTP/time issue
df -h                                   # SD/SSD full is the usual Docker killer
sudo apt update && sudo apt -y upgrade  # long; let it finish
sudo reboot                             # if the kernel/firmware updated
```

After reboot, confirm Docker:

```bash
docker --version
docker ps -a
docker compose ls    # or: cd to wherever your compose file lives, then:
# docker compose ps
```

On 2 Jun 2025 this lab installed Docker and a media stack (Jellyfin, Prowlarr, qBittorrent, Radarr, Sonarr). After a long shutdown those containers may be `Exited`. Start the compose project you actually still want — you do not have to bring *arr back on day one.

```bash
# Example only — use your real path when you find it
# find ~ /opt /home -name 'compose.yml' -o -name 'docker-compose.yml' 2>/dev/null
docker start CONTAINER_NAME
# or, in the compose directory:
# docker compose up -d
```

If Docker dies with disk or cgroup errors, fix **disk space and reboot** before reinstalling Docker.

## 5. Prove the home network, not just the Pi

From the Pi:

```bash
ip a
ip r
ping -c 2 1.1.1.1
ping -c 2 the-laptop-you-sshed-from
```

From the laptop:

- Browse `http://PI_IP:8096` if Jellyfin is running (default port).
- Confirm you can still reach the BT Hub admin page **from the LAN only**.

Write what you observed in [changelog.md](changelog.md) and fill blanks in [network.md](network.md) (hostname, private IP, Docker path). That is the documentation. The rack is not “up” until those two files match reality.

## 6. Optional: Jarvis desktop app

Only if the Elecrow (or any desktop session) is attached:

```bash
cd ~/JARVIS   # or wherever you cloned this repo
python3 jarvis_app.py
```

If tkinter is missing: `sudo apt-get install python3-tk`. Full install path is in the [repo root README](../README.md).

## 7. Optional: ESP32

Leave this until Ethernet and the Pi are boringly reliable.

- USB cable to a PC or the Pi, or power from a **3.3 V / 5 V as the board expects**.
- Confirm it joins Wi-Fi (serial monitor), not that it has a switch port.
- Sketches in this repo: `esp32-servo-hold/`, `esp32-three-servo-test/`. RF / smart-plug work is on other Jarvis branches — merge only what you still use.

## When it still will not come up

Work the ladder (same idea as helpdesk):

1. **Power** — PSU, Hub, switch brick.
2. **Link lights** — Layer 1. Bad cable beats clever config.
3. **Address** — Does the Pi have a DHCP lease? APIPA (`169.254.x.x`) means no DHCP.
4. **Gateway** — `ip r` must show the Hub LAN address as default.
5. **DNS** — IP pings but names fail.
6. **App** — Docker / Jarvis last.

Log the fault in one paragraph in [changelog.md](changelog.md). Symptom → what you tried → cause → fix. That entry is more useful than another uncommitted diagram.
