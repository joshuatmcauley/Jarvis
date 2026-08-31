#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-_}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEB_ROOT="/var/www/the-tidy-bee"
SITE_AVAIL="/etc/nginx/sites-available/the-tidy-bee"
SITE_EN="/etc/nginx/sites-enabled/the-tidy-bee"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run with sudo: sudo ./deploy/install-on-pi.sh YOURDOMAIN.com"
  exit 1
fi

if ! command -v nginx >/dev/null; then
  echo "Install nginx first: sudo apt-get install -y nginx"
  exit 1
fi

if ! command -v npm >/dev/null; then
  echo "Install Node.js first (see deploy/HOSTING.md)"
  exit 1
fi

echo "Building site in ${REPO_DIR}"
cd "$REPO_DIR"
npm ci
npm run build

mkdir -p "$WEB_ROOT"
rsync -a --delete "${REPO_DIR}/dist/" "$WEB_ROOT/"

sed "s/DOMAIN_NAME/${DOMAIN}/g" "${REPO_DIR}/deploy/nginx.conf" > "$SITE_AVAIL"
ln -sfn "$SITE_AVAIL" "$SITE_EN"
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo
echo "Files are in ${WEB_ROOT}"
echo "On your LAN try:  http://$(hostname -I | awk '{print $1}')"
echo "Next: attach the domain — follow tidy-bee/deploy/HOSTING.md"
if [[ "$DOMAIN" != "_" ]]; then
  echo "nginx server_name includes: ${DOMAIN} www.${DOMAIN}"
fi
