# Men's Fragrance Store Concept

A responsive storefront concept for an Egyptian men's fragrance brand. The current VÉLOR wordmark is a temporary visual placeholder and should be replaced after a final brand name is selected and cleared for use.

## Included
- English storefront navigation, product names, sections, cart, and checkout UI.
- Short Arabic fragrance descriptions inside product details.
- Pure-white product image canvases with matching image frames and centered `object-fit: contain` positioning.
- A two-item `BEST SELLERS` feature section immediately below the hero.
- One consistent modern editorial typography system across the hero and closing banner: heavy Manrope, tight uppercase tracking, and outlined display lines.
- Responsive product grid and mobile-first layout.
- Cart drawer, product detail modal, demo checkout, and WhatsApp handoff placeholder.
- Six individually cropped product-image canvases hosted in `fikra-eg/perfPictures/optimized/`; each uses the same 1000×1250 canvas and a calibrated bottle height for consistent visual scale.

## Run locally
Open `index.html` in a browser, or serve this folder with any static web server. An internet connection is required for the hosted product images and Google Fonts.

## Before launch
- Replace the temporary brand name after checking trademark, domain, and social handle availability.
- Replace demo product names, prices, scent notes, and descriptions with real product information.
- Confirm that the fragrance product photos and their visible trademarks are authorized for portfolio/commercial use; the optimized SVGs embed the original photos without altering product labels.
- Add the real WhatsApp number in `app.js` (`WHATSAPP_NUMBER`).
- Connect the checkout flow to the actual order process; the current checkout is a front-end demo only.

## Image alignment note
The six product assets are individually cropped around the bottle and placed on matching 1000×1250 white canvases. Their visible bottle heights are normalized to approximately 78.4% of the canvas, with a small safety margin to preserve caps, bottle edges, and shadows. The original product photography and labels are retained.
