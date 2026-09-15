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

**Status:** in progress / done  

**Fault I chose:** bad DNS  

**Symptom (user words):** e.g. “Internet is up but Google will not load.”

### Ladder

| Step | Command or check | Result |
|------|------------------|--------|
| 1 Physical | Lights / cable into TL-SG108S | |
| 2 Local IP | `ipconfig /all` | IP / mask / gateway / DNS = |
| 3 Gateway | `ping <gateway>` | |
| 4 DNS | `ping 1.1.1.1` vs `ping google.com` and `nslookup google.com` | |
| 5 Routing | skipped / `tracert` | |
| 6 Firewall | n/a | |
| 7 App | Chrome | |

**Cause:**

**Fix:**

**How I proved it:**

**Diary date:**

Put screenshots in `images/` (no Wi-Fi passwords).

---

## “Commit the write-up the same night”

Means: after the table is filled, **save it on GitHub** so it does not live in your head.

Easiest: open this file on GitHub → pencil **Edit** → paste your answers → Commit.

Or send the filled table here and it can be committed for you.

Do not wait until GitHub is “cleaned up.” This file is the clean-up.
