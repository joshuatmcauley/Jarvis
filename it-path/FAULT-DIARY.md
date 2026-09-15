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

### 2026-09-15 — example (delete when you have a real one)

- **Symptom (user words):** Pi has Wi-Fi icon but cannot load GitHub
- **Scope:** Pi only; phone on same SSID works
- **Ladder steps run:** 1 2 3 4 — DNS on the Pi pointed at a dead forwarder
- **Evidence:** `ping 1.1.1.1` OK, `ping github.com` fail, `resolvectl query github.com` timeout
- **Cause:** stale DNS on the Pi
- **Fix:** set DNS to the hub / 1.1.1.1, reboot resolve
- **How I proved it:** name lookup succeeded; page loaded
- **What I would do faster next time:** ping IP vs name before rebooting
- **GitHub:** n/a
