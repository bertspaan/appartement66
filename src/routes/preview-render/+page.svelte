<script lang="ts">
 import {base} from '$app/paths';
 import {onMount} from 'svelte';
 import type {createApartment} from '$lib/apartment';
 let host:HTMLDivElement;
 let status:'loading'|'ready'|'error'='loading';
 let error='';
 onMount(()=>{
  let disposed=false;
  let apartment:Awaited<ReturnType<typeof createApartment>>|undefined;
  async function render(){
   try{
    const {createApartment}=await import('$lib/apartment');
    apartment=await createApartment(host,()=>{});
    if(disposed){apartment.destroy();return;}
    apartment.view('preview');
    apartment.update({floor:'oak',light:'day',furniture:true,doorOpen:0,hallwayWall:true,doorsOpen:false,instrument:'upright',tipAge:'child'});
    await document.fonts.ready;
    // Let the renderer draw the updated furniture before declaring the image ready.
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
    if(!disposed)status='ready';
   }catch(cause){
    console.error(cause);
    if(!disposed){error='Het model kon niet worden geladen.';status='error';}
   }
  }
  void render();
  return()=>{disposed=true;apartment?.destroy();};
 });
</script>

<svelte:head>
 <title>Preview · Appartement van Sarah, Bert &amp; Tip</title>
 <meta name="robots" content="noindex"/>
</svelte:head>

<div class="card" data-preview-state={status} aria-label="Appartement van Sarah, Bert & Tip">
 <div class="model" bind:this={host}></div>
 <div class="title"><img src={`${base}/favicon.svg`} alt=""/><div>Appartement van<br/><strong>Sarah, Bert &amp; Tip</strong></div></div>
 {#if error}<p role="alert">{error}</p>{/if}
</div>

<style>
 :global(body){margin:0;background:#fff9ee}
 .card{position:relative;width:1200px;height:630px;overflow:hidden}
 .model{position:absolute;width:2400px;height:1260px;left:-600px;top:-365px}
 .title{position:absolute;left:28px;top:22px;display:flex;align-items:center;gap:15px;font:24px/1.3 system-ui;color:#20323c}
 .title strong{font-size:32px}.title img{width:62px;height:62px}
 .model :global(canvas){display:block}
 p{position:absolute;bottom:24px;left:28px;color:#8f2424;font:18px system-ui}
</style>
