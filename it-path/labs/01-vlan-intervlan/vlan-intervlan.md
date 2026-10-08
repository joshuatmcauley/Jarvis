
VLAN 10 Staff — 192.168.10.0/24 — gateway 192.168.10.1 — PC0 in this VLAN
VLAN 20 IoT — 192.168.20.0/24 — gateway 192.168.20.1 — PC1 in this VLAN
Router Gig0/0.10 — 192.168.10.1
Router Gig0/0.20 — 192.168.20.1
DHCP from the router, skip .1 on each subnet
DNS: 8.8.8.8 (does not need to work for the lab)
ACL: block 192.168.20.0/24 → 192.168.10.0/24, allow everything else
