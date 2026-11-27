"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ProfilePhotoManager({ initialPhoto }: { initialPhoto: string }) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  async function upload(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setMessage("Choose a JPG, PNG or WebP image."); return; }
    if (file.size > 1024 * 1024) { setMessage("Image must be smaller than 1 MB."); return; }
    setBusy(true); setMessage("");
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
      const response = await fetch("/api/profile/photo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: data }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setPhoto(data); setMessage("Profile photo updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true); setMessage("");
    try { const response = await fetch("/api/profile/photo", { method: "DELETE" }); if (!response.ok) throw new Error("Could not remove photo."); setPhoto(""); setMessage("Photo removed."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not remove photo."); }
    finally { setBusy(false); }
  }
  return <div style={{display:"flex",alignItems:"center",gap:14,marginTop:14,flexWrap:"wrap"}}>
    {photo ? <Image src={photo} alt="Your profile" width={76} height={76} unoptimized style={{width:76,height:76,borderRadius:"50%",objectFit:"cover",border:"2px solid #e9e0d5"}}/> : <div style={{width:76,height:76,borderRadius:"50%",display:"grid",placeItems:"center",background:"#760314",color:"white",fontSize:28,fontWeight:700}}>＋</div>}
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e=>upload(e.target.files?.[0])}/><button type="button" disabled={busy} onClick={()=>input.current?.click()} style={{padding:"9px 13px",borderRadius:8,border:"1px solid #760314",background:"white",color:"#760314",fontWeight:700}}>{busy?"Saving…":"Upload photo"}</button>{photo&&<button type="button" disabled={busy} onClick={remove} style={{padding:"9px 13px",borderRadius:8,border:"1px solid #d9cec3",background:"white"}}>Remove</button>}</div>
    {message&&<small role="status" style={{width:"100%",color:"#71686a"}}>{message}</small>}
  </div>;
}
