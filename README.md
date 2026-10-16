# YZAR HEALTHCARE

React storefront for YZAR HEALTHCARE. It sells food-category dietary supplements such as Vitamin D and multivitamins. Products and orders live in Firebase. There is no Node.js server. The site is ready to deploy on Vercel.

Customers can browse, add to cart, and place a cash-on-delivery order. Admins can add, edit, hide, and delete products, and can update order status.

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173

Without Firebase keys, the shop shows a sample catalog and a preview banner. Preview orders stay in that browser only. They do not reach the admin panel.

## Connect Firebase

1. Create a project at [Firebase console](https://console.firebase.google.com).
2. Add a **Web** app and copy its config.
3. Copy `.env.example` to `.env.local` and paste the config:

```bash
copy .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

4. Authentication → Sign-in method → enable **Email/Password**.
5. Authentication → Users → **Add user**. This is the admin login. There is no public sign-up page.
6. Firestore Database → create the database in **production mode**. Use the default database. `asia-south1` (Mumbai) is a good region.
7. Firestore → Rules → paste `firestore.rules` → Publish.
8. Copy the admin user’s **UID**.
9. Firestore → Data → start collection `admins`. Use the UID as the **document ID**, not an auto id. Add one field, `role` = `admin`.
10. Storage → get started → Rules → paste `storage.rules` → Publish.
11. Restart `npm run dev`.
12. Open `/admin/login`, sign in, then click **Load sample catalog** or add your own products.

If sign-in works but the panel does not open, the page shows the UID to paste into `admins`.

## Deploy on Vercel

1. Push this folder to GitHub. `.env.local` stays on your computer.
2. In Vercel, import the repository. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Add the same `VITE_FIREBASE_*` variables in Project → Settings → Environment Variables.
4. Deploy again after saving the variables. Vite reads them at build time.
5. In Firebase → Authentication → Settings → Authorized domains, add your Vercel domain.

`vercel.json` sends all routes to `index.html`, so refresh works on `/shop`, `/product/...`, and `/admin`.

## What to know

- Orders are cash on delivery. Confirm them in **Admin → Orders** before packing.
- Stock does not fall automatically. Update it when you edit the product.
- Product copy is written as food supplements, not as medicines that treat disease.
- Keep the admin password private. Anyone with that account and an `admins` document can change the catalog.
