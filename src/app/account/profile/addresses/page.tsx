"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Address = { label:string; line1:string; line2:string; locality:string; city:string; state:string; postalCode:string; country:string; isPrimary:boolean };
const empty:Address={label:"Home",line1:"",line2:"",locality:"",city:"",state:"",postalCode:"",country:"India",isPrimary:true};

export default function AddressesPage(){
 const [addresses,setAddresses]=useState<Address[]>([]);
 const [form,setForm]=useState<Address>(empty);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 useEffect(()=>{fetch("/api/profile").then(r=>r.json()).then(d=>{if(d.user?.addresses)setAddresses(d.user.addresses.map((a:Address)=>({...a})));}).catch(()=>setError("Unable to load saved addresses."));},[]);
 function update<K extends keyof Address>(key:K,value:Address[K]){setForm(prev=>({...prev,[key]:value}));}
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");setMessage("");try{
  if(addresses.length>=5)throw new Error("You can save up to 5 addresses.");
  const next=[...addresses.map(a=>({...a,isPrimary:form.isPrimary?false:a.isPrimary})),form];
  if(!next.some(a=>a.isPrimary))next[0].isPrimary=true;
  const res=await fetch("/api/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({addresses:next})});
  const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not save address.");
  setAddresses(data.user.addresses||next);setForm(empty);setMessage("Address saved successfully.");
 }catch(err){setError(err instanceof Error?err.message:"Something went wrong.");}finally{setBusy(false);}}
 const field={width:"100%",padding:12,border:"1px solid #d9cec3",borderRadius:9,background:"white",color:"#20191a"} as const;
 const label={display:"grid",gap:6,fontWeight:600} as const;
 return <main style={{minHeight:"100vh",background:"#f7f3ea",padding:"22px 14px",color:"#20191a"}}><section style={{maxWidth:680,margin:"0 auto",background:"#fffdfa",padding:20,borderRadius:16,border:"1px solid #e9e0d5"}}><Link href="/account/profile" style={{color:"#760314",fontWeight:700}}>← Back to profile</Link><h1 style={{fontSize:28,marginBottom:6}}>Manage addresses</h1><p style={{color:"#71686a",marginTop:0}}>Save up to five delivery or contact addresses. Choose one as your primary address.</p>
 <h2 style={{fontSize:19}}>Saved addresses ({addresses.length}/5)</h2>{addresses.map((a,i)=><div key={i} style={{padding:"10px 12px",border:"1px solid #e9e0d5",borderRadius:9,marginTop:8}}><b>{a.label}{a.isPrimary?" · Primary":""}</b><p style={{marginBottom:0}}>{[a.line1,a.line2,a.locality,a.city,a.state,a.postalCode,a.country].filter(Boolean).join(", ")}</p></div>)}
 <h2 style={{fontSize:19,marginTop:24}}>Add a new address</h2><form onSubmit={save} style={{display:"grid",gap:12}}>
 <label style={label}>Address label<select style={field} value={form.label} onChange={e=>update("label",e.target.value)}><option>Home</option><option>Work</option><option>Other</option></select></label>
 <label style={label}>Address line 1 *<input required maxLength={160} style={field} value={form.line1} onChange={e=>update("line1",e.target.value)}/></label>
 <label style={label}>Address line 2<input maxLength={160} style={field} value={form.line2} onChange={e=>update("line2",e.target.value)}/></label>
 <label style={label}>Area / locality<input style={field} value={form.locality} onChange={e=>update("locality",e.target.value)}/></label>
 <label style={label}>City *<input required style={field} value={form.city} onChange={e=>update("city",e.target.value)}/></label>
 <label style={label}>State *<input required style={field} value={form.state} onChange={e=>update("state",e.target.value)}/></label>
 <label style={label}>PIN code *<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} style={field} value={form.postalCode} onChange={e=>update("postalCode",e.target.value)}/></label>
 <label style={label}>Country<input required style={field} value={form.country} onChange={e=>update("country",e.target.value)}/></label>
 <label style={{display:"flex",gap:9,alignItems:"center"}}><input type="checkbox" checked={form.isPrimary} onChange={e=>update("isPrimary",e.target.checked)}/> Set as primary address</label>
 {error&&<p role="alert" style={{color:"#b42318",margin:0}}>{error}</p>}{message&&<p role="status" style={{color:"#287a3c",margin:0}}>{message}</p>}
 <button disabled={busy||addresses.length>=5} style={{padding:13,border:0,borderRadius:9,background:"#760314",color:"white",fontWeight:700,opacity:busy||addresses.length>=5?.6:1}}>{busy?"Saving…":"Save address"}</button>
 </form></section></main>;
}
