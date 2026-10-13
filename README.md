# ELORA — Thoughtfully Gifted

A responsive luxury gifting website for ELORA, built with HTML, CSS, vanilla JavaScript and Vite. Designed to work in Google AI Studio's web app workflow (including importing from GitHub) and on ordinary web hosts.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL shown in the terminal.

## Google AI Studio (Build mode)

1. Create a new GitHub repository and upload the files from this folder to the **repository root**, including the `public/assets` folder.
2. Open https://aistudio.google.com/ and go to **Build**.
3. In the prompt box click the **+** icon, choose **Import from GitHub**, and select that repository.
4. Ask AI Studio to preserve the existing site and run this Vite project using `npm install` and `npm run dev`; do not regenerate the site or replace its original assets.
5. Use the code editor or prompts to modify colours, products, prices, contact links, copy, etc.

> The AI Studio import UI may evolve. The project is intentionally compatible with a standard Node.js/Vite workflow. If GitHub import is unavailable, run it locally or push the repository into a connected AI Studio project.

## Business contact setup

Edit the first lines of `script.js`:

```js
const ELORA_CONFIG = {
  whatsapp: '919876543210',
  instagram: 'https://www.instagram.com/YOUR_HANDLE/',
  email: 'hello@yourdomain.com'
};
```

Replace those example values with ELORA's real contact information. A WhatsApp number uses international digits without the `+` sign (India code = 91).

## File map

- `index.html` — layout and content for all 8 sections
- `styles.css` — ivory / rose-gold theme, emerald corporate theme, responsive styling
- `script.js` — interactive menu, hampers, builder pricing, enquiries, gallery, contact settings
- `public/assets/` — original ELORA logo and image concepts
- `package.json` — Vite development, build and preview commands

## Important before a real launch

- Products/prices are illustrative and must be confirmed before publishing.
- Photos are visual design concepts, not evidence of completed customer orders. The gallery has a separate empty completed-orders view.
- Enquiry forms generate prepared messages; they do **not** send messages automatically or store them on a server.
- No payment processing, customer accounts, order management, or shipping integration is present.
- Replace placeholder business contact information. Check logo and typography details prior to commercial print.
