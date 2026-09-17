# IT path — plan, labs, GitHub

This folder is the working kit for getting from **kitchen + traineeship** to a **helpdesk / technician year**, then toward **network engineering**.

It is not more exam notes. It is a schedule, templates, and lab write-ups you fill in and push so GitHub shows real work.

**You:** Joshua McAuley · Ballymoney · CS (Liverpool Hope) · CompTIA Tech+ · A+ Core 1 passed, Core 2 in progress · IT Career Switch network engineer traineeship · Pi 5 + TL-SG108S homelab · Hyper-V DC01 `lab.local` (in progress).

Hardware inventory lives in [homelab](https://github.com/joshuatmcauley/homelab). Lab stories and job evidence live **here**.

## Open this order

1. [PLAN.md](PLAN.md) — 12-week calendar (start **15 Sep 2026**). Tick boxes as you go.
1b. [PORTFOLIO.md](PORTFOLIO.md) — Level 1 AD lab on GitHub, Entra vs AD, ticket sim (AI credited, later).
2. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — use this on every fault, including family IT.
3. [FAULT-DIARY.md](FAULT-DIARY.md) — log the fault. Ten real rows beat another video playlist.
4. [labs/](labs/) — one project at a time. Finish and commit before starting the next.
5. [TOOLS.md](TOOLS.md) — Windows + Pi commands (IP, gateway, DNS).
6. [STAR-STORIES.md](STAR-STORIES.md) — interview answers built from the diary and labs.
7. [APPLICATIONS.md](APPLICATIONS.md) — jobs you have actually sent.
8. [GITHUB.md](GITHUB.md) — how to pin this, write a profile README, and not dump secrets.

## Weekly rhythm (keep this even on chef weeks)

| Slot | What |
|------|------|
| 2–3 evenings | **A+ only** until Core 1 is sat. Then stop stacking certs. |
| 1 evening | Homelab: break one thing, fix it, write 10 lines in the diary + lab README. |
| 1 evening | Tools: Windows/Linux commands, Wireshark, or Entra/AD basics. |
| Weekend scrap | One physical or network task (cabling, Pi, Packet Tracer VLAN story). |
| Always | Applications. Do not wait for the car or the full cert stack. |

Driving test: **4 November 2026**. On applications that mention travel, write that the test is booked.

## What “done” looks like in 12 weeks

- [ ] A+ Core 1 sat (Core 2 scheduled or sat if you still have gas in the tank)
- [ ] VLAN / inter-VLAN lab write-up in `labs/01-vlan-intervlan/` with diagram + what you broke
- [ ] At least **8** fault-diary entries
- [ ] GitHub profile README + this folder linked from the Jarvis repo root
- [ ] [homelab](https://github.com/joshuatmcauley/homelab) README and inventory kept honest
- [ ] Applications going out every week (local + NI remote + station-accessible Belfast)
- [ ] 4 STAR stories you can say out loud in 90 seconds each

## Rules so this does not rot

- One lab in flight. Merge/commit when the README has a diagram, IP plan, and a “what failed” section.
- No production passwords, Wi-Fi keys, or BT Hub admin details in git.
- Unmanaged **TL-SG108S** cannot do VLANs. Do VLANs in **Packet Tracer / CML / GNS3** or as Linux VLANs/bridges on the Pi. Do not pretend the 108S is a Cisco.
- Traineeship cert order after A+: Network+ → Security+ → AZ-900 → CCNA. Do not study two exam tracks at once.
- Keep kitchen income until a **signed** IT offer.
