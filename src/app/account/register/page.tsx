"use client";

import Link from "next/link";
import { useState } from "react";

type Profile = { name:string; dateOfBirth:string; mobile:string; backupMobile:string; educationLevel:string; currentlyStudying:boolean };

export default function RegisterPage() {
  const [profile,setProfile]=useState<Profile>({name:"",dateOfBirth:"",mobile:"",backupMobile:"",educationLevel:"",currentlyStudying:false});
  const [email,setEmail]=useState("");
  const [code,setCode]=useState("");
  const [sent,setSent]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  async function sendCode(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const res=await fetch("/api/auth/email-otp/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,purpose:"register",profile})});
      const data=await res.json(); if(!res.ok) throw new Error(data.error||"Unable to send code");
      setSent(true);setMessage(data.message);
    } catch(err) {setError(err instanceof Error?err.message:"Something went wrong");} finally {setBusy(false);}
  }
  async function verify(e:React.FormEvent) {
    e.preventDefault();setBusy(true);setError("");
    try {
      const res=await fetch("/api/auth/email-otp/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,code,purpose:"register"})});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Verification failed");
      window.location.href=data.redirectTo||"/account/profile";
    } catch(err) {setError(err instanceof Error?err.message:"Something went wrong");} finally {setBusy(false);}
  }
  const field:React.CSSProperties={width:"100%",padding:"12px",border:"1px solid #d9cec3",borderRadius:9,background:"white",color:"#20191a"};
  const label:React.CSSProperties={display:"grid",gap:6,fontSize:14,fontWeight:600};
  return <main style={{minHeight:"100vh",background:"#f7f3ea",padding:"32px 16px",color:"#20191a"}}><section style={{maxWidth:620,margin:"0 auto",background:"#fffdfa",padding:28,borderRadius:18,border:"1px solid #e9e0d5",boxShadow:"0 12px 36px #3d1b1510"}}><Link href="/" style={{color:"#760314",fontWeight:700}}>← S K Stationary</Link><h1 style={{fontSize:28,margin:"22px 0 6px"}}>Create your account</h1><p style={{color:"#71686a",marginTop:0}}>Verify your email to create a secure account.</p>
  <form onSubmit={sent?verify:sendCode} style={{display:"grid",gap:14}}>
  {!sent&&<><label style={label}>Full name<input required maxLength={100} style={field} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></label>
  <label style={label}>Date of birth<input required type="date" max={new Date().toISOString().slice(0,10)} style={field} value={profile.dateOfBirth} onChange={e=>setProfile({...profile,dateOfBirth:e.target.value})}/></label>
  <label style={label}>Mobile number (not verified)<input type="tel" style={field} value={profile.mobile} onChange={e=>setProfile({...profile,mobile:e.target.value})}/></label>
  <label style={label}>Backup mobile (optional)<input type="tel" style={field} value={profile.backupMobile} onChange={e=>setProfile({...profile,backupMobile:e.target.value})}/></label>
  <label style={label}>Email address<input required type="email" style={field} value={email} onChange={e=>setEmail(e.target.value)}/></label>
  <label style={label}>Education level<select style={field} value={profile.educationLevel} onChange={e=>setProfile({...profile,educationLevel:e.target.value})}><option value="">Select education level</option>{["Below 10th","10th","12th","Diploma","Undergraduate","Postgraduate","Other"].map(v=><option key={v}>{v}</option>)}</select></label>
  <label style={{display:"flex",gap:9,alignItems:"center"}}><input type="checkbox" checked={profile.currentlyStudying} onChange={e=>setProfile({...profile,currentlyStudying:e.target.checked})}/> I am currently studying</label></>}
  {sent&&<><p style={{background:"#f2f7ef",padding:12,borderRadius:8}}>A 6-digit code was sent to <b>{email}</b>. It expires in 5 minutes.</p><label style={label}>Email verification code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} style={field} value={code} onChange={e=>setCode(e.target.value)}/></label></>}
  {error&&<p role="alert" style={{color:"#b42318",margin:0}}>{error}</p>}{message&&<p role="status" style={{color:"#287a3c",margin:0}}>{message}</p>}
  <button disabled={busy} style={{padding:14,border:0,borderRadius:9,background:"#760314",color:"white",fontWeight:700,opacity:busy?.7:1}}>{busy?"Please wait…":sent?"Verify email & create account":"Send verification code"}</button>
  {sent&&<button type="button" onClick={()=>{setSent(false);setCode("");setMessage("");}} style={{border:0,background:"transparent",color:"#760314"}}>Back to details</button>}
  </form><p style={{marginTop:20,fontSize:14}}>Already registered? <Link href="/account/login" style={{color:"#760314",fontWeight:700}}>Log in</Link></p></section></main>;
}
