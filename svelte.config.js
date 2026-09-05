import adapter from '@sveltejs/adapter-static';

// Production lives at bertspaan.nl/appartement66; local development stays at /.
const base = process.argv.includes('dev') ? '' : (process.env.BASE_PATH ?? '/appartement66');

/** @type {import('@sveltejs/kit').Config} */
export default {
 kit: {
  adapter: adapter({pages: 'build', assets: 'build', fallback: '404.html', strict: true}),
  paths: {base, relative: false}
 }
};
