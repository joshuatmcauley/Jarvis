
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\Users\Owner> ipconfig /all

Windows IP Configuration

   Host Name . . . . . . . . . . . . : DESKTOP-UT50TBB
   Primary Dns Suffix  . . . . . . . :
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No
   WINS Proxy Enabled. . . . . . . . : No

Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . : home
   Description . . . . . . . . . . . : Realtek Gaming 2.5GbE Family Controller
   Physical Address. . . . . . . . . : 34-5A-60-7F-29-D7
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   IPv6 Address. . . . . . . . . . . : 2a00:23cc:fd2d:8201:280d:ea49:c177:8714(Preferred)
   Temporary IPv6 Address. . . . . . : 2a00:23cc:fd2d:8201:85b6:a94:2324:7fd5(Preferred)
   Link-local IPv6 Address . . . . . : fe80::9a0d:3c06:e5bb:e61f%10(Preferred)
   IPv4 Address. . . . . . . . . . . : 192.168.1.103(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : 15 September 2026 19:04:11
   Lease Expires . . . . . . . . . . : 16 September 2026 19:04:10
   Default Gateway . . . . . . . . . : fe80::32b1:b5ff:fe75:6a35%10
                                       192.168.1.254
   DHCP Server . . . . . . . . . . . : 192.168.1.254
   DHCPv6 IAID . . . . . . . . . . . : 70539872
   DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-2D-9C-12-1D-34-5A-60-7F-29-D7
   DNS Servers . . . . . . . . . . . : fe80::32b1:b5ff:fe75:6a35%10
                                       192.168.1.254
                                       fe80::32b1:b5ff:fe75:6a35%10
   NetBIOS over Tcpip. . . . . . . . : Enabled
   Connection-specific DNS Suffix Search List :
                                       home

Wireless LAN adapter Local Area Connection* 9:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Microsoft Wi-Fi Direct Virtual Adapter
   Physical Address. . . . . . . . . : 86-9E-56-02-A3-65
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes

Wireless LAN adapter Local Area Connection* 10:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Microsoft Wi-Fi Direct Virtual Adapter #2
   Physical Address. . . . . . . . . : 86-9E-56-02-B3-75
   DHCP Enabled. . . . . . . . . . . : No
   Autoconfiguration Enabled . . . . : Yes

Wireless LAN adapter WiFi:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . : home
   Description . . . . . . . . . . . : RZ616 Wi-Fi 6E 160MHz
   Physical Address. . . . . . . . . : 84-9E-56-02-83-45
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes

Ethernet adapter Bluetooth Network Connection:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Bluetooth Device (Personal Area Network)
   Physical Address. . . . . . . . . : 84-9E-56-02-83-46
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
PS C:\Users\Owner> ping 1.1.1.1

Pinging 1.1.1.1 with 32 bytes of data:
Reply from 1.1.1.1: bytes=32 time=20ms TTL=57
Reply from 1.1.1.1: bytes=32 time=20ms TTL=57
Reply from 1.1.1.1: bytes=32 time=21ms TTL=57
Reply from 1.1.1.1: bytes=32 time=20ms TTL=57

Ping statistics for 1.1.1.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 20ms, Maximum = 21ms, Average = 20ms
PS C:\Users\Owner> ping google.com

Pinging google.com [2a00:1450:4009:c13::71] with 32 bytes of data:
Reply from 2a00:1450:4009:c13::71: time=22ms
Reply from 2a00:1450:4009:c13::71: time=22ms
Reply from 2a00:1450:4009:c13::71: time=22ms
Reply from 2a00:1450:4009:c13::71: time=23ms

Ping statistics for 2a00:1450:4009:c13::71:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 22ms, Maximum = 23ms, Average = 22ms
PS C:\Users\Owner> nslookup google.com
Server:  bthub.home
Address:  fe80::32b1:b5ff:fe75:6a35

Non-authoritative answer:
Name:    google.com
Addresses:  2a00:1450:4009:c13::65
          2a00:1450:4009:c13::64
          2a00:1450:4009:c13::8a
          2a00:1450:4009:c13::71
          142.250.140.101
          142.250.140.113
          142.250.140.102
          142.250.140.139
          142.250.140.100
          142.250.140.138

PS C:\Users\Owner> tracert -d 1.1.1.1

Tracing route to 1.1.1.1 over a maximum of 30 hops

  1     3 ms     1 ms     1 ms  192.168.1.254
  2     6 ms     9 ms     5 ms  172.16.19.51
  3     *        *        *     Request timed out.
  4    19 ms    19 ms    19 ms  62.172.102.228
  5    18 ms    18 ms    18 ms  194.74.16.211
  6    19 ms    19 ms    19 ms  109.159.253.95
  7    21 ms    20 ms    20 ms  141.101.71.213
  8    19 ms    19 ms    19 ms  1.1.1.1

Trace complete.
PS C:\Users\Owner>





Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\Users\Owner> Get-NetIPConfiguration


InterfaceAlias       : Ethernet
InterfaceIndex       : 10
InterfaceDescription : Realtek Gaming 2.5GbE Family Controller
NetProfile.Name      : BT-NNAW99
IPv6Address          : 2a00:23cc:fd2d:8201:280d:ea49:c177:8714
IPv4Address          : 192.168.1.103
IPv6DefaultGateway   : fe80::32b1:b5ff:fe75:6a35
IPv4DefaultGateway   : 192.168.1.254
DNSServer            : fe80::32b1:b5ff:fe75:6a35
                       fe80::32b1:b5ff:fe75:6a35
                       192.168.1.254

InterfaceAlias       : WiFi
InterfaceIndex       : 7
InterfaceDescription : RZ616 Wi-Fi 6E 160MHz
NetAdapter.Status    : Disconnected

InterfaceAlias       : Bluetooth Network Connection
InterfaceIndex       : 3
InterfaceDescription : Bluetooth Device (Personal Area Network)
NetAdapter.Status    : Disconnected



PS C:\Users\Owner>
