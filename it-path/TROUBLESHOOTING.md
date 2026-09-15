# Troubleshooting ladder

Use this in order. Do not jump to “it’s DNS” or “reboot it” until the step that proves it.

Write the step number in the fault diary. If you skipped a step, say why.

## 1. Physical

- Power, LEDs, cable seated both ends, correct port, Wi-Fi actually associated, RSSI not terrible.
- Swap cable / known-good port before you blame the OS.

**Prove it:** link light, `ethtool` / adapter status, or Wi-Fi connected with a sane signal.

## 2. Local address

- Do you have an IP? APIPA (`169.254.x.x`) means DHCP failed or you are isolated.
- Wrong static mask/gateway looks “connected” and still dead.

**Prove it:** `ipconfig /all` or `ip a`. Note MAC, DHCP server, lease.

## 3. Gateway

- Ping the default gateway.
- If local IP works and gateway does not: L2/VLAN/port/ACL/Wi-Fi isolation, not “the internet is down.”

**Prove it:** ping gateway IP. Then ARP (`arp -a` / `ip neigh`).

## 4. DNS

- Ping a **name** and an **IP** (e.g. `1.1.1.1` vs `cloudflare.com`).
- Names fail / IPs work → DNS. Both fail past the gateway → routing/firewall/WAN.

**Prove it:** `nslookup` / `dig`. Which server answered? NXDOMAIN vs timeout.

## 5. Routing / WAN

- Traceroute. Where does it die? First hop, ISP, or destination?
- On this lab: BT Hub is the WAN edge. Do not debug “Cisco core” you do not have.

**Prove it:** `tracert` / `traceroute` and a second device on the same LAN.

## 6. Firewall / ACL / filtering

- Host firewall, hub parental controls, Pi `nftables`/`ufw`, Packet Tracer ACL.
- Symptom: ping works, app does not, or one VLAN cannot reach another.

**Prove it:** temporarily allow, or capture SYN with no SYN-ACK.

## 7. App / identity

- Wrong password, MFA, expired account, time wrong (Kerberos), proxy, TLS intercept, app not bound to the right NIC.

**Prove it:** another user / another app / another device.

---

## Helpdesk version (say this on the phone)

1. What changed? (update, cable, new kit, password)
2. Who else is affected?
3. Wired or wireless?
4. IP or name failure?
5. Since when?

Then walk the ladder. Tickets that get you noticed are the ones where you **narrowed scope** before you guessed.
