# Commands evening (Windows PC + Pi)

Same night as the break-fix lab, or the next spare 20 minutes. You are not configuring anything. You are learning what “normal” looks like on **your** network.

Your path: **BT Hub** → Wi-Fi → **BT Smart Disk** → Ethernet → **TL-SG108S** → Windows PC and Pi.

---

## On the Windows PC

Open Command Prompt. Run one line at a time. Read the output. You do not need to memorise flags.

| Command | What you are looking at |
|---------|-------------------------|
| `ipconfig /all` | Your IP, mask, gateway (BT Hub), DNS, MAC, DHCP yes/no |
| `ping 1.1.1.1` | “Can I reach the internet by number?” |
| `ping google.com` | “Can I turn a name into a number and reach it?” |
| `nslookup google.com` | Which DNS server answered, and what IP it gave |
| `tracert -d 1.1.1.1` | Each hop toward the internet. First hop should be the hub. `-d` skips slow name lookups |
| `Get-NetIPConfiguration` | PowerShell version of “how is this NIC set up?” |

If `1.1.1.1` pings and `google.com` does not, that is DNS. If neither works but the gateway pings, that is past your LAN (hub/WAN). If the gateway does not ping, that is your cable, NIC, or hub.

---

## On the Pi (SSH or a keyboard on the Pi)

| Command | What you are looking at |
|---------|-------------------------|
| `ip a` | Interfaces and IPs (like ipconfig) |
| `ip r` | Default route (like “gateway”) |
| `ping -c 4 1.1.1.1` | Four pings, then it stops (`-c 4`) |
| `ping -c 4 google.com` | Name vs number, same as Windows |
| `tracepath 1.1.1.1` or `traceroute -n 1.1.1.1` | Hops. Install traceroute later if missing; `tracepath` is often already there |
| `resolvectl status` **or** `cat /etc/resolv.conf` | Which DNS the Pi is using |

---

## Done when

You can glance at `ipconfig /all` or `ip a` and point at: **my IP**, **gateway**, **DNS**. That is the evening. No extra projects.
