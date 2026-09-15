# Lab 01 — VLANs, inter-VLAN routing, DHCP, ACL, then break it

**Status:** not started / in progress / done (delete two)

**Where it runs:** Packet Tracer / GNS3 / CML / Linux VLANs on the Pi  
**Not on:** TP-Link TL-SG108S (unmanaged — no 802.1Q)

## 90-second script (fill last)

> 

## Topology

Paste a diagram or link `images/topology.png`.

Physical homelab (for honesty): BT Hub → BT Wi-Fi disk → TL-SG108S → Pi 5. That LAN is **flat**. This lab is the **virtual** network you can explain in interview.

## Addressing

| VLAN | Name | Subnet | Gateway | DHCP pool | Allowed to |
|------|------|--------|---------|-----------|------------|
| 10 | | | | | |
| 20 | | | | | |
| 99 | Mgmt | | | | |

## What I built

- [ ] Two user VLANs
- [ ] Inter-VLAN routing (SVI or ROAS)
- [ ] DHCP per VLAN
- [ ] DNS pointed somewhere you control or can explain
- [ ] One ACL (e.g. VLAN 20 cannot reach VLAN 10 server subnet, but can reach DNS/gateway)
- [ ] SSH or secure management on the router/switch **in the sim**

## Forced failure (required)

What I broke:

What the “user” saw:

Ladder step that caught it:

Fix:

## Config snippets (sanitised)

```text
paste brief running-config pieces, not a dump of the whole device
```

## Files

- Packet Tracer / GNS3: `vlan-lab.pkt` (or screenshots if the file is huge)
- `images/`

## Limitations

Unmanaged 108S, domestic BT Hub, no spare managed switch unless you buy one later. This lab is still valid as a design + troubleshooting story.
