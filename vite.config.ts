import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import {optimizeAssets} from './scripts/optimize-assets.mjs';
export default defineConfig(async()=>{
 await optimizeAssets();
 return {plugins:[sveltekit()]};
});
