# Fault diary

Copy a blank block for each incident. Newest at the top. Redact names, IPs of other people’s networks, and passwords.

**Study weak spots (Week 1):**

- Core 1 objective 1: `_`
- Core 1 objective 2: `_`
- Core 1 objective 3: `_`

---

## Template

```md
### YYYY-MM-DD — short title

- **Symptom (user words):**
- **Scope:** just me / whole LAN / one VLAN / one app
- **Ladder steps run:** 1 2 3 4 5 6 7 (circle what proved the cause)
- **Evidence:** commands, LED, screenshot name
- **Cause:**
- **Fix:**
- **How I proved it:**
- **What I would do faster next time:**
- **GitHub:** link to lab folder if any
```

---

## Log

### 2026-09-15 — bad DNS lab (Windows Ethernet)

- **Symptom (user words):** Can ping 1.1.1.1 but cannot find host google.com
- **Scope:** this PC only (Ethernet on TL-SG108S)
- **Ladder steps run:** 1 2 3 **4** (5 skipped)
- **Evidence:** DNS `::1` + `127.0.0.1`; `nslookup` no response; after `ipconfig /flushdns`, ping name failed; IP ping still 20ms
- **Cause:** DNS pointed at localhost; Wi-Fi + IPv6 DNS + cache delayed the symptom
- **Fix:** DNS Automatic; `nslookup` via `bthub.home`
- **How I proved it:** google.com resolved and pinged again
- **What I would do faster next time:** Wi-Fi off, break IPv4 and IPv6 DNS, flush cache before declaring “it still works”
- **GitHub:** `it-path/labs/02-break-fix/`
