# Lab 02 — Break something, then fix it like a ticket

This is **not** a VLAN project. You break **one** setting on purpose so a website fails, then you prove what is wrong using the same checks a helpdesk tech uses.

Use **your Windows desktop** (the one on the switch in your diagram). Leave the Pi alone for this one so you cannot brick remote access.

**Pick this fault (do not pick four):** bad DNS.

What that means: the PC can still reach the internet by **number** (`1.1.1.1`) but not by **name** (`google.com`). That is a classic “Wi-Fi is connected but Chrome does not load” ticket.

---

## Before you break anything (10 minutes)

Open **Command Prompt** or **PowerShell** on the Windows PC. Run these and **screenshot** or copy the text (this is your “working” baseline):

```bat
ipconfig /all
ping 1.1.1.1
ping google.com
nslookup google.com
tracert -d 1.1.1.1
```

In PowerShell you can also run:

```powershell
Get-NetIPConfiguration
```

You should see: an IPv4 address, a Default Gateway (almost certainly your **BT Hub**), and DNS servers. Ping to `1.1.1.1` and `google.com` should both work.

Write those numbers on paper or in the table at the bottom. You need them to put DNS back.

---

## Break it (2 minutes)

1. Settings → Network & internet → Ethernet → your connection → **DNS server assignment** → Edit → **Manual**.
2. Turn IPv4 DNS on.
3. Set Preferred DNS to `127.0.0.1` (that is “this PC”, which is not a DNS server).
4. Save.

Open Chrome. A normal website should fail or hang. That is the “user complaint.”

---

## Fix it using the ladder (do not skip steps)

Work top to bottom. Fill the table as you go.

1. **Physical** — Cable in the switch? Link lights on the TL-SG108S? You already know this is fine; still say so. This trains you not to jump to DNS.
2. **Local IP** — `ipconfig` again. Do you still have a real address (not `169.254.x.x`)?
3. **Gateway** — `ping` the Default Gateway from ipconfig. Should work.
4. **DNS** — `ping 1.1.1.1` works, `ping google.com` fails. `nslookup google.com` errors or times out. **This is the cause.**
5. **Routing** — You can skip a long traceroute once step 4 is proven. Note that you skipped it and why.
6. **Firewall** — Not this lab.
7. **App** — Chrome fails because names do not resolve, not because Chrome is broken.

Put DNS back: Automatic (DHCP) **or** `1.1.1.1` / `8.8.8.8`. Save.

Proof: `ping google.com` works, Chrome loads, `nslookup google.com` shows an answer.

---

## Fill this in (this *is* the lab)

**Status:** done (15 Sep 2026, DESKTOP-UT50TBB)

**Fault I chose:** bad DNS (IPv4 `127.0.0.1` + IPv6 `::1` on Ethernet)

**Symptom (user words):** Internet feels up but Google will not resolve.

### Ladder

| Step | Command or check | Result |
|------|------------------|--------|
| 1 Physical | Cable into TL-SG108S | First `ipconfig` showed Ethernet APIPA `169.254.x.x` (no DHCP). After seating/link: Ethernet `192.168.1.103`. |
| 2 Local IP | `ipconfig /all` | Ethernet `192.168.1.103/24`, DHCP yes, suffix `home`. |
| 3 Gateway | Default gateway on Ethernet | `192.168.1.254` (BT Hub). `ping 1.1.1.1` 20ms — WAN OK. |
| 4 DNS | `ping 1.1.1.1` vs `ping google.com` / `nslookup` | After Wi-Fi off + DNS `::1`/`127.0.0.1`: `nslookup` → `No response from server` (server `::1`). `ping 1.1.1.1` still OK. `ping google.com` still worked until `ipconfig /flushdns`, then `could not find host google.com`. |
| 5 Routing | skipped | WAN already proven by `1.1.1.1`. |
| 6 Firewall | n/a | Not this fault. |
| 7 App | names | Failure was resolution, not Chrome. |

**Cause:** Manual DNS pointed at this PC (`127.0.0.1` / `::1`), which is not a DNS server. Cached names hid it until flush.

**Fix:** Ethernet DNS back to Automatic. `nslookup` answered via `bthub.home`. `ping google.com` replies again.

**How I proved it:** `nslookup google.com` returned A/AAAA from the hub; ping to google.com succeeded.

**Diary date:** 2026-09-15

**Gotchas (keep these):**
- Breaking DNS on Ethernet does nothing if **Wi-Fi is still up** with the hub as DNS.
- IPv6 DNS (`fe80::…` on the hub) will ignore an IPv4-only `127.0.0.1` break.
- `ping google.com` can succeed after DNS is dead because of **cache** — always `ipconfig /flushdns`.

---

## “Commit the write-up the same night”

Means: after the table is filled, **save it on GitHub** so it does not live in your head.

Easiest: open this file on GitHub → pencil **Edit** → paste your answers → Commit.

Or send the filled table here and it can be committed for you.

Do not wait until GitHub is “cleaned up.” This file is the clean-up.
