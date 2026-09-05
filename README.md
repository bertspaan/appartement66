# Eureka apartment studio

GitHub Pages deploys automatically on pushes to `apartment-viewer`; manual runs are also available.

SvelteKit + Three.js, with static output. All processing is local; there is no runtime account, database, or model upload service.

## Run

```sh
npm install
npm run dev
```

`npm run check` checks Svelte/TypeScript. `npm run build` generates `build/`, suitable for static hosting. Open the URL printed by Vite.

## Model

`static/model/` contains real geometry extracted from the provided SketchUp model using OpenSKP (MIT), clipped to the corner apartment confirmed by the user. GLB units are metres, Y-up. `manifest.json` records original component paths, classification and the crop coordinates. The original SketchUp file remains untouched in this directory.

- `shell.glb`: exterior/demising walls and identified structural/service elements.
- `existing.glb`: original interior elements, shown only in Source model mode.
- `floor.glb`: clipped source slabs.

The extraction is a first pass, not a construction plan. The inner clear rectangle is approximately 9.32 × 7.58 m, with 2.62 m height above the model floor. These figures are derived from model geometry, not independently surveyed. The window recesses and service area mean this rectangle is not a usable-floor-area calculation. Original nonstructural classification uses location and source element labels; services and retained masonry need confirmation from architectural drawings. Crop edges can be uncapped.

The two bedrooms are editable proposals, with 90 cm door openings and approximate furniture. Floor colours, transparent glazing and lighting are visualization assumptions. Sun direction is illustrative: the source geolocation is incorrect for the Netherlands. Walk mode is constrained to the apartment envelope but passes through interior objects. The download button exports the visible model geometry, not a photometric lighting study.

OpenSKP: https://github.com/iamahsanmehmood/openskp (MIT)
Three.js: https://github.com/mrdoob/three.js (MIT)
SvelteKit: https://github.com/sveltejs/kit (MIT)


## Hand sketch layout

The default layout now follows `PXL_20260905_101619644.jpg`: two bedrooms along the bottom facade, a diagonal bedroom front wall, and a short slanted translucent hallway/living partition. The sliding door control moves the leaf over the fixed panel. Coordinates are traced approximately and stored in `src/lib/sketch-layout.ts`. Bedroom entry positions and frosted material properties are provisional. The original service-core geometry is shown in sketch mode.

## Wraparound balcony

`static/model/balcony.glb` restores the original slab and exterior elements on both exposed sides, using two non-overlapping crop strips recorded in the manifest. This is the corner balcony, not a balcony through the neighbouring apartments. The app adds a provisional 1.10 m glass/metal railing along the outer two edges; its height and design are not taken from verified construction details. Camera framing and walk bounds include the balcony.

The app now displays only the hand-sketched layout. Layout switching and the model-label overlay have been removed; source GLBs are retained for provenance.

## Furniture and divider update

The bedroom divider centre is x=1.94 m, so its 5 cm half-thickness reaches the start of the source window frame at x=1.99 m (43 cm farther right than before). Tip has an approximate 1.04 × 2.10 m loft bunk with toys below. The upright piano is 1.35 m wide and follows the diagonal on the living-room side of the translucent partition. The baby-blue floor lamp follows the supplied articulated-lamp reference; its dimensions are approximate. Dining, bedside and child-room lights are also included and illuminate in evening mode. Furniture is shown by default.

## GitHub Pages

The static adapter outputs `build/`, including `.nojekyll` and a `404.html` fallback. Navigation and GLB URLs respect `BASE_PATH`; local development always uses `/`.

To build for `bertspaan.nl/appartement66`:

```sh
npm run build
```

Production defaults to `/appartement66` for `https://bertspaan.nl/appartement66/`. Override `BASE_PATH` only when hosting elsewhere; use an empty value for a domain root.

When you decide to publish:

1. Ensure the desired code is on your GitHub repository.
2. In Settings → Pages, choose **GitHub Actions** as the build source.
3. Push to `apartment-viewer`, or select **Publish to GitHub Pages** in Actions and click **Run workflow**.

The workflow uses `/appartement66` as the production base path, builds with the existing npm lockfile, and publishes only `build/`. It runs on pushes to `apartment-viewer` and supports manual runs. No publishing or remote changes were performed while adding this configuration.

Reference: https://svelte.dev/docs/kit/adapter-static#GitHub-Pages

## Balcony planting

The two balcony rectangles are modelled as 1.00 m tall planters in their source footprints (1.60 × 2.20 m and 2.20 × 1.40 m), with soil, mixed broad-leaved shrubs, grasses and flowers. Plant choices are visual placeholders. Original low landscaping trays are hidden in the app and visible-only exports. The planters remain visible independently of the furniture toggle.

## Sofa

The living-room sofa is a modelled approximation of the FEST Edge 3-seater in anthracite, using the official 254 × 103 × 71 cm dimensions, 43 cm seat height and 62 cm seat depth. Two seat modules, broad arms, low feet and visible seat seams are represented. The exact anthracite fabric is approximate. Source: https://www.festamsterdam.com/products/edge-3-zits-bank

The translucent partition has been shifted approximately 46 cm toward the hallway for piano clearance. Its service-frontage anchor is now (0, -1.90) and its bedroom-wall junction remains an orthogonal projection. The first bedroom entrance moves along the diagonal to clear the junction. The hallway sliding door retains a 1.10 m opening. This remains a proposed layout to check against service-room access on detailed drawings.

## Update the social preview

```sh
npm run preview:image
```

This starts a temporary local Vite server, opens `/preview-render/` in headless **Google Chrome installed on macOS**, waits for the model to render, and replaces `static/og-apartment.jpg` with a 1200 × 630 JPEG. It closes its browser and server afterwards and leaves an existing dev server alone. No separate browser download is needed; `playwright-core` controls the installed Chrome using a temporary profile. If Chrome is installed somewhere else, set `CHROME_PATH` to its executable.

Run the command after changing the model and before building or committing the updated preview. It does not commit or publish anything. If rendering fails, the previous image is preserved.

The permanent render page is also available at `/preview-render/` under the site's base path (production: `/appartement66/preview-render/`). It uses a dedicated overview distance and keeps the enlarged composition with the title and logo. Edit `src/routes/preview-render/+page.svelte` to change its framing or furniture options.

## Performance and generated assets

`npm run build` automatically creates optimized runtime assets before Vite builds the site. The same generation runs when starting the dev server or rendering the social preview. Originals remain in `static/art/` and `static/model/`; generated files live in ignored `static/optimized/`. A content-hash cache skips unchanged inputs. Run `npm run optimize:assets` to regenerate while a dev server is already running.

- Paintings become WebP images with a maximum dimension of 1024 px; posters use 512 px. Aspect ratios and poster texture crops are preserved.
- GLB files use glTF Transform vertex welding and deduplication, preserving source metadata and architectural dimensions. No lossy wall simplification is applied.
- The production build removes the original runtime images/models from `build/`, keeping only the optimized copies. Source files in the project are never deleted.
- Static opaque details are batched by material. Tiny spheres and rods use fewer segments; transparent surfaces, moving door leaves, textures and lamp materials remain separate.
- Furniture is built once; changing Tip's age or instrument only replaces that variant. Floor, lighting and door controls do not rebuild the furniture.
- Rendering sleeps when the camera and scene are idle. Shadows are cached until geometry, visibility or lighting changes. Orbit damping, keyboard movement and mouse look request frames as needed.

Run `npm run benchmark` with installed macOS Chrome (or `CHROME_PATH`) to measure draw calls, geometry, update time and idle frames. It also checks variant switching, geometry cleanup, cached shadows and overview arrow keys. `createApartment().stats()` exposes these counters for development; they are not shown in the website UI.
