"use client";
import { useState } from "react";
export default function SignOutButton(){const [busy,setBusy]=useState(false);async function signOut(){setBusy(true);try{await fetch("/api/auth/logout",{method:"POST"});}finally{window.location.href="/account/login";}}return <button onClick={signOut} disabled={busy} style={{padding:"10px 14px",border:"1px solid #d9cec3",borderRadius:9,background:"white",color:"#760314",fontWeight:700}}>{busy?"Signing out…":"Sign out"}</button>;}
