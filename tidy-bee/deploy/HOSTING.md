# Host The Tidy Bee on a Raspberry Pi

Do **not** use `npm run dev` on the Pi for this. That is a development server. For a real domain, build the site once and serve the files with nginx.

Two ways to attach your domain:

| Method | Use when | Router changes |
|---|---|---|
| **A. Cloudflare Tunnel** | Home internet, CGNAT, or you do not want to open ports | None |
| **B. Port forward + Let's Encrypt** | You have a real public IPv4 and can forward 80/443 | Yes |

Most UK home connections are easier with **A**.

Replace `YOURDOMAIN.com` everywhere with the domain you bought.

---

## 0. On the Pi (SSH)

```bash
sudo apt-get update
sudo apt-get install -y git nginx

# Node 22 (needed to build the site)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

cd ~
git clone https://github.com/joshuatmcauley/Jarvis.git
cd Jarvis
git checkout cursor/tidy-bee-website-c4d5
cd tidy-bee
sudo ./deploy/install-on-pi.sh YOURDOMAIN.com
```

If Jarvis is already cloned, `git pull` on that branch then run `install-on-pi.sh` again after you change the site.

The script copies the built files to `/var/www/the-tidy-bee` and enables nginx.

Check on your home Wi‑Fi first:

`http://PI_LAN_IP`  (example `http://192.168.1.42`)

---

## A. Cloudflare Tunnel (recommended)

You keep nginx on the Pi. Cloudflare gives the internet a hostname and tunnels traffic in. No port 80/443 on the router.

1. Add the site in [Cloudflare](https://dash.cloudflare.com) (free plan is enough).
2. At the place you bought the domain, change **nameservers** to the two Cloudflare nameservers they show. Wait until the domain shows **Active**.
3. On the Pi:

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o cloudflared
# Pi 4 32-bit instead: cloudflared-linux-arm
sudo mv cloudflared /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared
cloudflared tunnel login
cloudflared tunnel create tidy-bee
```

`tunnel login` opens a URL — open it on your laptop while logged into Cloudflare.

4. Copy the tunnel id from the command output. Create `/etc/cloudflared/config.yml`:

```yaml
tunnel: TUNNEL_ID
credentials-file: /home/pi/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: YOURDOMAIN.com
    service: http://127.0.0.1:80
  - hostname: www.YOURDOMAIN.com
    service: http://127.0.0.1:80
  - service: http_status:404
```

Use your real username in the credentials path (`whoami`).

5. Point DNS at the tunnel:

```bash
cloudflared tunnel route dns tidy-bee YOURDOMAIN.com
cloudflared tunnel route dns tidy-bee www.YOURDOMAIN.com
```

6. Run it as a service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

HTTPS is handled by Cloudflare. Open `https://YOURDOMAIN.com`.

---

## B. Port forward + Let's Encrypt

Only if you can open **80** and **443** to the Pi, and `https://ifconfig.me` from the Pi matches the IP the router shows as WAN (if they differ, you are on CGNAT — use method A).

1. Router: forward TCP **80** and **443** to the Pi’s LAN IP. Give the Pi a DHCP reservation so that IP does not change.
2. At your registrar (or Cloudflare DNS if you already moved nameservers), create:

   - `A`  `@` → your **public** IPv4  
   - `A`  `www` → same IP  

   If the home IP changes, use a dynamic DNS updater (Cloudflare API token, or DuckDNS plus a CNAME).

3. On the Pi:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOURDOMAIN.com -d www.YOURDOMAIN.com
sudo systemctl reload nginx
```

Certbot will edit the nginx site and renew automatically.

---

## Update the site later

On the Pi:

```bash
cd ~/Jarvis
git pull
cd tidy-bee
sudo ./deploy/install-on-pi.sh YOURDOMAIN.com
```

---

## Files this folder uses

| Path | Role |
|---|---|
| `/var/www/the-tidy-bee` | Live website files |
| `/etc/nginx/sites-available/the-tidy-bee` | nginx vhost |
| `tidy-bee/deploy/nginx.conf` | Template copied by the install script |
