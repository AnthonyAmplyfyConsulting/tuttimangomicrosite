# Tutti Mango | Mango Drop

A mobile-first rewards demo. Players open the homepage, drop a mango through the pegboard, and reveal a sample Eve’s Mangonada coupon.

## Run locally

```sh
python3 -m http.server 8000 --directory dist
```

Open [localhost:8000](http://localhost:8000). The site uses HTML, CSS, and JavaScript and requires no build step. To deploy it to a static host, serve the `dist/` directory.

The sample coupons have no in-store redemption. The QR under `dist/qr/` points to the existing private demo. Replace the QR and update its page copy if you deploy to a different URL or audience.
