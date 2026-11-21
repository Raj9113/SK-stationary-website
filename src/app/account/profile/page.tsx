import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

function ageFromDob(value: Date | string) {
  const dob = new Date(value); const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  if (now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) age--;
  return age;
}

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/account/login");
  return <main style={{minHeight:"100vh",background:"#f7f3ea",padding:"30px 16px",color:"#20191a"}}><section style={{maxWidth:850,margin:"0 auto",background:"#fffdfa",padding:28,borderRadius:18,border:"1px solid #e9e0d5"}}><Link href="/" style={{color:"#760314",fontWeight:700}}>← S K Stationary</Link><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div><h1 style={{fontSize:28,marginBottom:4}}>My profile</h1><p style={{color:"#71686a",marginTop:0}}>Your personal account information</p></div><SignOutButton/></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:20}}>{[["Full name",user.name],["Date of birth",new Date(user.dateOfBirth).toLocaleDateString("en-IN")],["Age",String(ageFromDob(user.dateOfBirth))+" years"],["Email",user.email],["Email status",user.emailVerified?"Verified":"Unverified"],["Mobile",user.mobile||"Not added"],["Backup mobile",user.backupMobile||"Not added"],["Education",user.educationLevel||"Not specified"],["Currently studying",user.currentlyStudying?"Yes":"No"]].map(([label,value])=><div key={label} style={{padding:14,border:"1px solid #e9e0d5",borderRadius:10}}><small style={{color:"#71686a"}}>{label}</small><div style={{fontWeight:700,marginTop:5,overflowWrap:"anywhere"}}>{value}</div></div>)}</div><h2 style={{marginTop:28}}>Saved addresses</h2>{user.addresses?.length?user.addresses.map((a,index)=><div key={String(a._id||index)} style={{padding:14,border:"1px solid #e9e0d5",borderRadius:10,marginTop:8}}><b>{a.label} {a.isPrimary?"· Primary":""}</b><p style={{marginBottom:0}}>{[a.line1,a.line2,a.locality,a.city,a.state,a.postalCode,a.country].filter(Boolean).join(", ")}</p></div>):<p style={{color:"#71686a"}}>No saved addresses yet.</p>}<p style={{marginTop:24}}><Link href="/account/profile/edit" style={{display:"inline-block",padding:"12px 18px",background:"#760314",color:"white",borderRadius:9,fontWeight:700}}>Edit profile</Link></p></section></main>;
}
