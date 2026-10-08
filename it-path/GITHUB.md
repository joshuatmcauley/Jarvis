# Put this on GitHub so people can see it

Jarvis is public. Prefer **homelab** and **ad-lab** for employers. This `it-path/` folder is a working notebook; do not treat agent PRs as the CV.

## 1. What to pin

On github.com/joshuatmcauley → **Customize your pins** (up to 6):

1. [homelab](https://github.com/joshuatmcauley/homelab) — rack, switch, Pi
2. [ad-lab](https://github.com/joshuatmcauley/ad-lab) — Hyper-V AD DS helpdesk lab (when README is honest)
3. One shipping project: [the-tidy-bee](https://github.com/joshuatmcauley/the-tidy-bee) **or** [defect-detection-systemv1](https://github.com/joshuatmcauley/defect-detection-systemv1)
4. Do not pin Jarvis as the IT CV unless you want the Pi GUI on the front page

Optional later: a profile README repo named `joshuatmcauley/joshuatmcauley` (does not exist yet). Paste the profile draft below into `README.md` there if you create it.

## 2. How to commit a lab (every time)

```bash
cd Jarvis
git checkout main
git pull
git checkout -b lab/vlan-story   # or lab/break-fix, etc.
# edit it-path/labs/...
git add it-path
git commit -m "Add VLAN lab write-up and forced DNS failure."
git push -u origin lab/vlan-story
```

Open a pull request on GitHub and merge it. Recruiters rarely read branches; they read `main`.

Same idea for [homelab](https://github.com/joshuatmcauley/homelab): inventory and topology updates belong there, not secrets.

## 3. Screenshot rules

- Blur serials, public IP, Wi-Fi password, BT admin, customer data
- Show: topology, VLAN table, Wireshark filter + one packet, `ipconfig /all` with MAC truncated if you want
- Store images in the lab folder (`labs/01-vlan-intervlan/images/`) or GitHub issue comments if they are large

## 4. Profile README draft (create repo `joshuatmcauley` if you want this on your front page)

```md
# Joshua McAuley
Ballymoney, Northern Ireland · Computer Science (BSc) · helpdesk / ICT technician → network engineering

Currently completing a network engineering traineeship (CompTIA Tech+ held; A+ in progress; Network+, Security+, AZ-900, CCNA on the year-one path). Looking for a first-line / technician role for a year to build real faults before owning LANs.

**Now:** [IT path plan and labs](https://github.com/joshuatmcauley/Jarvis/tree/main/it-path) · [Homelab](https://github.com/joshuatmcauley/homelab)

**Also:** Raspberry Pi / ESP32 builds in Jarvis · other repos pinned below
```

## 5. Repo hygiene

| Do | Do not |
|----|--------|
| Traineeship as *currently completing* | Title yourself Network Engineer |
| Unmanaged TL-SG108S called unmanaged | Fake Cisco configs as if they run on the 108S |
| Packet Tracer + Pi Linux VLANs | Commit `.pkt` with internal company designs (you have none — still keep it clean) |
| Fault diary with redaction | Live passwords, API keys, `.env` |

`.gitignore` already drops logs and local config JSON for Jarvis. Never add `config/settings.json` with tokens.
