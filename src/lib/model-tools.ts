export function registerModelTools(configure:(layout:string)=>void){
 const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>Promise<void>|void}}).modelContext;
 const lifecycle=new AbortController();
 if(context?.registerTool){try{Promise.resolve(context.registerTool({name:'configure_apartment_layout',description:'Show the open shell, original source interior, or proposed two-bedroom layout.',inputSchema:{type:'object',properties:{layout:{type:'string',enum:['shell','existing','bedrooms']}},required:['layout'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input:unknown){const x=input as {layout?:unknown};if(!x||typeof x!=='object'||Object.keys(x).length!==1||!['shell','existing','bedrooms'].includes(String(x.layout)))throw new Error('Expected layout: shell, existing, or bedrooms');configure(String(x.layout));return {layout:x.layout};}},{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional browser API; app controls remain available. */}}
 return ()=>lifecycle.abort();
}
