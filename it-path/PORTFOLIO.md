# Level 1 portfolio (AD lab + tickets)

This is the employer-facing skill plan. It is **not** the Packet Tracer fictional network (do that first, then come back to DC01).

Hyper-V is the **platform**. Listing Hyper-V on a CV matters less than AD, Entra/M365, Windows, tickets, and DNS/DHCP. Use Hyper-V anyway because that is how the lab runs.

## Will AD / Azure / Hyper-V help Level 1?

Yes, if they are **real** and you can talk through a fault.

Priority for helpdesk:

1. Active Directory (resets, unlocks, groups, permissions)
2. Microsoft 365 / Entra ID (users, licences, MFA, account issues) — say **Entra**, not “Azure” unless you mean Azure VMs
3. Windows (updates, printers, Event Viewer)
4. Tickets and how you speak to users
5. DNS, DHCP, IP, Wi-Fi, VPN basics
6. Remote tools and a bit of PowerShell

Hyper-V: useful, not the main Level 1 skill.

A+ Core 1 is done. Core 2 still counts. Certs do not replace a lab you can demo.

## What “Active Directory” on the CV means

Comfortable enough to list **AD DS** (not Entra) if you can:

- Install Server, promote a DC, know domain vs forest vs OU vs DC
- Create / disable users and computers
- Reset passwords, unlock accounts
- Security groups
- Join a Windows PC to the domain
- Simple GPOs (password/lockout, screen lock, mapped drive)
- Share vs NTFS permissions
- ADUC, GPMC, Event Viewer, `gpupdate` / `gpresult`
- Why AD needs DNS
- Failed logon / lockout / “can’t get to the share”
- A few PowerShell commands you actually ran

Do not write “Azure AD administrator.” Lab tenant Entra is a **separate** line.

## GitHub project (public): `ad-lab`

You already started this: DC01, `lab.local`, `192.168.10.10`, ADUC works. CSV/script was **not** finished (empty `users.csv`).

Target repo layout:

```
ad-lab/
  README.md
  architecture/          (diagram)
  scripts/
    New-LabUsers.ps1
    Disable-Leaver.ps1
    Get-LockedAccounts.ps1
  sample-data/
    fictional-users.csv
  runbooks/
    new-starter.md
    account-lockout.md
    gpo-troubleshooting.md
  evidence/              (screenshots, no passwords)
```

Build order (one slice at a time):

1. Finish CSV + `New-LabUsers.ps1` on DC01 (OUs: Sales, IT, HR, Computers — not one flat LabUsers forever)
2. Windows 11 client VM, join `lab.local`
3. GPOs + one file share with group permissions
4. Runbooks for reset / unlock / starter / leaver / failed logon / GPO
5. Two or three **fault write-ups** (wrong OU, lockout, share denied)

README: goal, diagram, what you built, what broke, what you learned.

Never commit: VHDs, passwords, licence keys, real people, work IPs.

**CV line (when the list above is true):**

Active Directory home lab: deployed Windows Server AD DS and DNS in Hyper-V; users, OUs and groups; joined a Windows client; Group Policy and share permissions; PowerShell onboarding from CSV; Level 1 runbooks. Not production.

## Ticket simulator (later, separate)

After the AD lab is real, optional **second** repo: fake tickets (AD, M365, printers, VPN, Windows). Fictional names only.

Your evidence is **how you handled tickets** (notes, replies, escalate), not the app.

YouTube: 3–4 tickets, **including one you escalate**. Do not say you can solve everything.

**Credit (keep this wording):**

The ticket-simulator application was generated with AI assistance. I designed the ticket scenarios and used it to demonstrate my helpdesk workflow. The diagnoses, responses, resolutions and documentation are my own.

Do not put simulator code in `ad-lab`. Do not present yourself as the app’s author.

## Order vs other work

1. Packet Tracer fictional network (other chat) — pause DC01 (Saved/Off)
2. Back here: fill `users.csv`, run the script, then client join / GPO
3. Core 2 + job applications in parallel
4. Entra lab tenant (short) — different CV bullet
5. Ticket sim + video last

## Resume bookmark (DC01)

- Server 2022 Desktop Experience, domain `lab.local`, IP `192.168.10.10`
- Logon: `Administrator` on LAB
- `C:\lab\users.csv` was 0 KB — must paste rows before the script
- DSRM password is not the Administrator password
