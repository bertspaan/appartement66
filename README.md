# Eureka apartment studio

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

Optional WebMCP: `configure_apartment_layout`, feature-detected and unregistered when the page closes. A live WebMCP host was not available for contract validation.
