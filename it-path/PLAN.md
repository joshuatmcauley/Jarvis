# 12-week plan (from 15 Sep 2026)

Tick boxes in GitHub as you finish them. If a week is brutal at work, do the **must** line only. Do not skip applications.

Legend: **Must** = non-negotiable · **Lab** = GitHub evidence · **Job** = applications · **Life** = licence / money / energy.

---

## Week 1 — 15–21 Sep 2026 · book A+, start evidence

**Must**
- [ ] Timed A+ Core 1 practice. Write the 3 weakest objective codes in [FAULT-DIARY.md](FAULT-DIARY.md) (study section).
- [/] Book Core 1 on Pearson VUE (aim for week 3–4, not “someday”).
- [ ] Send **5** applications (helpdesk, service desk, desktop, IT technician, junior network support). Log them in [APPLICATIONS.md](APPLICATIONS.md).

**Lab**
- [/] Photograph / sketch the real rack: BT Hub → Wi-Fi disk → TL-SG108S → Pi 5. Drop the sketch into [homelab](https://github.com/joshuatmcauley/homelab) `docs/network.md` **or** `labs/01-vlan-intervlan/topology.md` here.
- [ ] First fault-diary row: anything you already fixed (Wi-Fi, Pi, printer, family PC).

**Life**
- [/] Driving lessons / mock as scheduled. Do not pause job hunt for the car.

---

## Week 2 — 22–28 Sep · A+ weak spots + first break/fix

**Must**
- [ ] Two 60–90 min A+ sessions on **wrong answers only** (not whole courses again).
- [ ] 5 more applications.

**Lab**
- [x] Follow [labs/02-break-fix/README.md](labs/02-break-fix/README.md): **bad DNS on the Windows PC only**. Fill the table. Save the file on GitHub the same night.

**Tools (one evening)**
- [ ] [TOOLS.md](TOOLS.md) — run the Windows list, then the Pi list. You are done when you can point at IP, gateway, and DNS.

---

## Week 3 — 29 Sep–5 Oct · Core 1 crunch

**Must**
- [ ] Another timed Core 1 practice. If 80%+, keep the booked date. If not, move the exam **once**, not forever.
- [ ] 5 applications. Include NICS / local councils / MSPs around Ballymoney, Coleraine, Ballymena if live.

**Lab**
- [/] Start Packet Tracer (or GNS3) file for `labs/01-vlan-intervlan/`: two VLANs, SVI or router-on-a-stick, DHCP, one ACL.
- [/] Save the `.pkt` (or screenshots if file is huge) and a text IP plan. **No** “I’ll document later.”

**Life**
- [/] Confirm Pearson VUE ID, payment, and travel/online exam setup.

---

## Week 4 — 6–12 Oct · sit Core 1 if booked · VLAN story

**Must**
- [ ] Sit A+ Core 1 **or** sit the extra practice and lock a new date this week.
- [ ] 5 applications. Update CV with “Core 1 sat / scheduled dd Mon” if true.

**Lab**
- [ ] Finish VLAN lab README: diagram, VLAN table, DHCP pools, ACL, **and** a forced failure (e.g. client in wrong VLAN, ACL blocking DHCP, DNS pointing at a black hole).
- [ ] Record a 90-second explanation out loud. If you cannot say it without notes, the README is not done.

**GitHub**
- [ ] Follow [GITHUB.md](GITHUB.md): pin Jarvis, homelab, tidy-bee or defect-detection, and this path via the Jarvis README.

---

## Week 5 — 13–19 Oct · Core 2 light **or** Network+ labs if Core 1 is done

**Must**
- [ ] If Core 1 passed: 3 evenings Core 2 **or** rest 4 days then Core 2 plan. Do not start CCNA books yet.
- [ ] If Core 1 failed: only the failed domains. Rebook inside 2 weeks.
- [ ] 5 applications.

**Lab**
- [ ] `labs/03-windows-linux-support/`: one Windows VM + the Pi. Shared folder or Samba, a local user, a printer **or** a mock “new starter” checklist.
- [ ] One diary entry written like a ticket (symptom → steps → cause → fix → how you proved it).

---

## Week 6 — 20–26 Oct · packets and identity

**Must**
- [ ] 5 applications. Follow up anything with no reply after 10 days (one short email).

**Lab**
- [ ] `labs/04-packet-capture/`: capture DHCP or DNS on Wireshark (Pi mirror, VM host-only, or Windows). Screenshot of the **offer/ack** or DNS query/response. Write what each packet proved.
- [ ] `labs/05-ad-identity-basics/`: even if you have no domain — Entra free tenant **or** a local AD lab VM. Create a user, a group, a password reset note. Screenshot with names redacted.

**Life**
- [ ] Driving: mock test or extra hours if the 4 Nov date is still on.

---

## Week 7 — 27 Oct–2 Nov · polish + interview bank

**Must**
- [ ] 5 applications. Target titles: IT Support Technician, Service Desk Analyst, Desktop Support, NOC Technician, Junior Network Support.

**Lab**
- [ ] Fill [STAR-STORIES.md](STAR-STORIES.md) with 4 stories: hospitality pressure, a homelab break/fix, VLAN failure, a time you did not know and found out.
- [ ] Re-read every lab README. Add a “limitations” line (unmanaged switch, BT Hub as gateway, etc.).

**Life**
- [ ] Papers for the driving test. Sleep. Do not cram A+ the night before a practical test week if Core 1 is already done.

---

## Week 8 — 3–9 Nov · driving test week (4 Nov)

**Must**
- [ ] Driving test 4 Nov. If pass: update applications (“full UK licence”). If fail: rebook, keep applying, say “licence in progress, test booked”.
- [ ] Light applications only (3 is enough this week).

**Lab**
- [ ] Physical technician skills: terminate or re-terminate one Ethernet, test continuity, label both ends. Photo in `labs/` or homelab docs. Safety first.
- [ ] Optional: ESP32/Pi monitoring is fine **after** the cable task. Do not hide in Arduino-land to avoid job hunt.

---

## Week 9 — 10–16 Nov · Network+ **labs**, not a new binge

**Must**
- [ ] If both A+ cores are done: open Network+ **lab** list (subnetting practice, ports you have used, Wi-Fi vs Ethernet faults). Still one track.
- [ ] 5 applications. Belfast roles near the train are fair game with a licence.

**Lab**
- [ ] Add NAT or a simple firewall rule to the VLAN project **or** a second break/fix: “user can ping IP but not names.”
- [ ] Update [homelab](https://github.com/joshuatmcauley/homelab) inventory if anything new was bought.

---

## Week 10 — 17–23 Nov · look like a technician

**Must**
- [ ] 5 applications. MSPs and schools/colleges in the Ballymoney–Coleraine–Ballymena triangle.

**Lab**
- [ ] New-starter / joiner runbook: account, MFA, laptop, email, VPN, 30-minute script. Put it in `labs/03-windows-linux-support/joiner-runbook.md`.
- [ ] Cabling photo + patch-panel / switch-port table even if the 108S is unmanaged (port 1 = BT, port 2 = Pi, …).

---

## Week 11 — 24–30 Nov · interview reps

**Must**
- [ ] Mock interview: 90-second VLAN story, 90-second break/fix, “why helpdesk first,” “why networking after.” Record yourself once.
- [ ] 5 applications.

**Lab**
- [ ] Spare: document one ESP32 or Pi service **as a network client** (IP, DHCP or static, what happens if DNS dies). Keep it short.

---

## Week 12 — 1–7 Dec · freeze and send

**Must**
- [ ] Freeze new projects. Fix READMEs. Pin repos. Put traineeship as *currently completing*, not “I am a network engineer.”
- [ ] 10 applications this week if you still have no interviews.
- [ ] Decide Core 2 / Network+ date only if A+ Core 1 is passed.

**Check “done” from [README.md](README.md)** and tick it there.

---

## After week 12 (helpdesk year)

Do not invent a new 12-week cert gauntlet. At work:

- Volunteer for printers, Wi-Fi, cabling, patching, new starters, comms cupboard.
- Ask the network person for 20 minutes after a change.
- Keep the fault diary. After 3 months you will have better STAR stories than any Packet Tracer file.

Traineeship remaining: Network+ → Security+ → AZ-900 → CCNA, **one at a time**, around the job.

---

## If you fall behind

Skip order of sacrifice: extra Arduino/3D-print work → extra cert videos → **never** skip the week’s applications and the one lab commit.
