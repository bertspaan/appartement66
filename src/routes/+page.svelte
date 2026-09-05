<script lang="ts">
 import {base} from '$app/paths';
 import {onMount} from 'svelte';
 import type {createApartment} from '$lib/apartment';
 let host:HTMLDivElement;let api:Awaited<ReturnType<typeof createApartment>>|undefined;
 let drawer:HTMLDialogElement;let isMobile=false,settingsOpen=false;
 function openSettings(){drawer.showModal();settingsOpen=true;}
 onMount(()=>{
  const media=window.matchMedia('(max-width:800px)');
  const sync=()=>{drawer.close();settingsOpen=false;isMobile=media.matches;drawer.open=!isMobile;};
  sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);
 });
 let tipAge:'child'|'teen'='child';
 let instrument:'upright'|'nord'='upright';
 let floor='oak',light='day',furniture=true,doorOpen=0,hallwayWall=true,doorsOpen=false;
 let ready=false,error='',hint='Het appartement laden…',mode='orbit';
 function update(){api?.update({floor,light,furniture,doorOpen,hallwayWall,doorsOpen,instrument,tipAge});}
 $: if(ready && api) api.update({floor,light,furniture,doorOpen,hallwayWall,doorsOpen,instrument,tipAge});
 function view(v:string){mode=v;api?.view(v);}
 onMount(()=>{let disposed=false;import('$lib/apartment').then(async m=>{const a=await m.createApartment(host,message=>hint=message);if(disposed){a.destroy();return;}api=a;ready=true;update();}).catch(e=>{console.error(e);error='Het model kon niet worden geladen. Vernieuw de pagina om het opnieuw te proberen.';});return()=>{disposed=true;api?.destroy();};});
</script>
<svelte:head><title>Appartement van Sarah, Bert &amp; Tip</title><meta name="description" content="Bekijk de indeling, materialen en verlichting van het appartement."/>
 <link rel="canonical" href="https://bertspaan.nl/appartement66/"/>
 <meta property="og:type" content="website"/>
 <meta property="og:locale" content="nl_NL"/>
 <meta property="og:site_name" content="Appartement van Sarah, Bert &amp; Tip"/>
 <meta property="og:title" content="Appartement van Sarah, Bert &amp; Tip"/>
 <meta property="og:description" content="Neem een kijkje in ons appartement: indeling, meubels en balkon in 3D."/>
 <meta property="og:url" content="https://bertspaan.nl/appartement66/"/>
 <meta property="og:image" content="https://bertspaan.nl/appartement66/og-apartment.jpg"/>
 <meta property="og:image:type" content="image/jpeg"/>
 <meta property="og:image:width" content="1200"/>
 <meta property="og:image:height" content="630"/>
 <meta property="og:image:alt" content="3D-overzicht van het appartement van Sarah, Bert en Tip, met meubels en balkon."/>
 <meta name="twitter:card" content="summary_large_image"/>
 <meta name="twitter:title" content="Appartement van Sarah, Bert &amp; Tip"/>
 <meta name="twitter:description" content="Neem een kijkje in ons appartement: indeling, meubels en balkon in 3D."/>
 <meta name="twitter:image" content="https://bertspaan.nl/appartement66/og-apartment.jpg"/>
 <meta name="twitter:image:alt" content="3D-overzicht van het appartement van Sarah, Bert en Tip, met meubels en balkon."/>
</svelte:head>
<div class="app">
 <header><a href={`${base}/`} class="brand"><img class="mark" src={`${base}/favicon.svg`} alt="" width="28" height="28"/> <span class="apartment-name">Appartement van Sarah, Bert &amp; Tip</span></a><span class="badge">ZUIDOOST · 4E VERDIEPING</span></header>
 <main>
  <dialog class="settings-drawer" bind:this={drawer} aria-label="Instellingen" onclose={()=>settingsOpen=false} onclick={event=>{if(isMobile&&event.target===drawer)drawer.close();}} onkeydown={()=>{}}>
  <aside>
   <div class="drawer-heading"><h2>Instellingen</h2><button class="close-settings" aria-label="Instellingen sluiten" onclick={()=>drawer.close()}>✕</button></div>
   <fieldset disabled={!ready}><legend><span>Hal</span></legend>
   <label class="check"><input type="checkbox" bind:checked={hallwayWall}/>Lichtdoorlatende wand met schuifdeur</label>
   {#if hallwayWall}<div class="dimensions"><label for="door">Schuifdeur <output>{Math.round(doorOpen*100)}% open</output></label><input id="door" type="range" min="0" max="1" step=".01" bind:value={doorOpen}/></div>{/if}
   </fieldset>
   <fieldset disabled={!ready}><legend><span>Deuren</span></legend><label class="check"><input type="checkbox" bind:checked={doorsOpen}/>Deuren 45° open</label></fieldset>
   <fieldset disabled={!ready}><legend><span>Materialen & sfeer</span></legend><label for="floor">Vloerafwerking</label><select id="floor" bind:value={floor}><option value="oak">Naturel eiken</option><option value="concrete">Licht beton</option><option value="walnut">Donker notenhout</option></select><div class="segmented">{#each [['day','Daglicht'],['evening','Avond']] as i}<button class:chosen={light===i[0]} onclick={()=>{light=i[0];update();}} aria-pressed={light===i[0]}>{i[1]}</button>{/each}</div><label class="check"><input type="checkbox" bind:checked={furniture}/>Meubels tonen</label></fieldset>
   <fieldset class="instrument" disabled={!ready}><legend><span>Instrument</span></legend>
    <label class="check"><input type="radio" name="instrument" value="upright" bind:group={instrument}/>Akoestische piano</label>
    <label class="check"><input type="radio" name="instrument" value="nord" bind:group={instrument}/>Nord Electro</label>
   </fieldset>
   <fieldset class="instrument" disabled={!ready}><legend><span>Tips kamer</span></legend>
    <label class="check"><input type="radio" name="tip-age" value="child" bind:group={tipAge}/>Tip 5 jaar oud</label>
    <label class="check"><input type="radio" name="tip-age" value="teen" bind:group={tipAge}/>Tip als tiener</label>
   </fieldset>
   <button class="download" disabled={!ready} onclick={()=>api?.download().catch(e=>{console.error(e);error='Het downloaden is niet gelukt. Probeer het opnieuw.';})}>3D-model downloaden <span>↗</span></button>
  </aside>
  </dialog>
  <section class="workspace" aria-label="Interactief model van het appartement">
   <div class="canvas" bind:this={host}></div>
   <nav aria-label="Weergave">{#each [['orbit','3D-overzicht'],['plan','Plattegrond'],['walk','Rondlopen']] as v}<button disabled={!ready} class:chosen={mode===v[0]} onclick={()=>view(v[0])}>{v[1]}</button>{/each}</nav>
   {#if !ready || error}<div class="loading" role="status">{error||'Het appartement laden…'}</div>{/if}
   <div class="viewer-footer">
    <div class="help">{hint}</div>
    <button class="open-settings" onclick={openSettings} aria-haspopup="dialog" aria-expanded={settingsOpen}>Instellingen</button>
   </div>
  </section>
 </main>
</div>
<style>
 :global(*){box-sizing:border-box} :global(body){margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#20323c;background:#f6f8f9;font-size:16px} :global(button),:global(select),:global(input){font:inherit} :global(button){cursor:pointer} :global(button:disabled){opacity:.5;cursor:wait} :global(button:focus-visible),:global(select:focus-visible),:global(input:focus-visible){outline:3px solid #127c99;outline-offset:3px}header{height:48px;display:flex;justify-content:space-between;align-items:center;padding:0 32px;border-bottom:1px solid #dce2e6;background:white}.brand{display:flex;gap:14px;align-items:center;text-decoration:none;color:inherit;font-size:17px;font-weight:700;letter-spacing:.08em}.mark{display:block;width:28px;height:28px;flex-shrink:0;border-radius:7px}.apartment-name{letter-spacing:0;font-weight:550}.badge{font-size:12px;letter-spacing:.12em;color:#657982}.settings-drawer{display:contents}.drawer-heading,.open-settings{display:none}main{display:grid;grid-template-columns:320px 1fr;height:calc(100dvh - 48px);min-height:650px}aside{overflow:auto;background:white;padding:30px 26px;display:flex;flex-direction:column;gap:27px;border-right:1px solid #dce2e6}fieldset{border:0;padding:0;margin:0;min-width:0}legend{font-size:12px;color:#75909e;letter-spacing:.06em;margin-bottom:15px}legend span{font-size:15px;font-weight:600;color:#263e49;letter-spacing:0}.dimensions{padding-top:15px}label{font-size:14px;display:block;color:#596f7a}output{float:right}input[type=range]{width:100%;accent-color:#2b7289;margin:10px 0 13px}select{width:100%;padding:10px;border:1px solid #d9e1e5;border-radius:7px;background:white;color:#294450;margin-top:8px;font-size:14px}.segmented{display:flex;padding:4px;background:#edf1f3;border-radius:8px;margin:13px 0 18px}.segmented button{flex:1;border:0;background:transparent;padding:8px;font-size:14px;color:#637780;border-radius:5px}.segmented .chosen{background:white;color:#234959;box-shadow:0 1px 4px #0001}.check{display:flex;gap:10px;align-items:center}.instrument .check + .check{margin-top:12px}.check input{flex-shrink:0;width:17px;height:17px;accent-color:#347a91}.download{margin-top:auto;background:#244e60;color:white;border:0;border-radius:8px;padding:12px;font-size:13px;text-align:left}.download span{float:right}.workspace{position:relative;min-width:0;overflow:hidden}.canvas{position:absolute;inset:0}.canvas :global(canvas){display:block;width:100%;height:100%}nav{position:absolute;top:10px;left:50%;transform:translateX(-50%);display:flex;gap:3px;padding:3px;border:1px solid #d3dce1;border-radius:10px;background:#fffc;backdrop-filter:blur(12px);white-space:nowrap}nav button{border:0;background:none;color:#566d79;padding:9px 13px;border-radius:6px;font-size:14px}nav .chosen{background:#244e60;color:white}.help{position:absolute;bottom:22px;left:28px;color:#556f7b;font-size:12px;background:#ffffffbd;border-radius:5px;padding:7px 10px}.loading{position:absolute;top:45%;left:50%;transform:translateX(-50%);background:white;padding:20px;border-radius:12px;box-shadow:0 5px 35px #0001;max-width:90%}@media(max-width:800px){header{padding:0 10px;height:40px}.badge{display:none}.brand{font-size:14px;gap:8px}.apartment-name{max-width:260px}.app{height:100dvh;overflow:hidden}main{display:block;height:calc(100dvh - 40px);min-height:0}.workspace{height:100%;min-height:0}
 .settings-drawer{display:none;position:fixed;inset:0 0 0 auto;width:min(360px,calc(100% - 24px));height:100dvh;max-height:100dvh;max-width:none;margin:0;padding:0;border:0;border-radius:16px 0 0 16px;color:inherit;background:white;box-shadow:-8px 0 40px #0003}
 .settings-drawer[open]{display:block}.settings-drawer::backdrop{background:#142d3a55}
 aside{min-height:100%;padding:16px 20px max(24px,env(safe-area-inset-bottom));gap:24px;border:0;overflow:visible}
 .drawer-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.drawer-heading h2{margin:0;font-size:18px}.close-settings{width:44px;height:44px;border:0;background:#edf1f3;border-radius:8px;color:#244e60}
 .viewer-footer{position:absolute;left:10px;right:10px;bottom:max(14px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:8px;pointer-events:none}.open-settings{display:block;flex-shrink:0;pointer-events:auto;min-height:44px;padding:10px 15px;border:1px solid #d3dce1;border-radius:9px;background:#fff;color:#244e60;font-size:14px;box-shadow:0 2px 12px #0002}nav{top:5px;gap:2px;padding:2px}nav button{padding:8px 9px}.help{position:static;flex:1;min-width:0;font-size:12px;pointer-events:none}}
</style>
