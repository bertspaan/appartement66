<script lang="ts">
 import {base} from '$app/paths';
 import {page} from '$app/state';
</script>
<svelte:head><title>{page.status === 404 ? 'Pagina niet gevonden' : 'Er ging iets mis'} · Appartement van Sarah, Bert &amp; Tip</title></svelte:head>
<main>
 <h1>{page.status === 404 ? 'Pagina niet gevonden' : 'Er ging iets mis'}</h1>
 <p>{page.status === 404 ? 'Deze pagina bestaat niet.' : 'De pagina kon niet worden geladen. Probeer het opnieuw.'}</p>
 <a href={`${base}/`}>Terug naar het appartement</a>
</main>
<style>
 main{max-width:36rem;margin:15vh auto;padding:2rem;font-family:system-ui,sans-serif;color:#20323c;line-height:1.6}h1{font-size:1.5rem}a{color:#24677d}
</style>
