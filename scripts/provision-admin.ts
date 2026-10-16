import { createClient } from '@supabase/supabase-js';
import { canProvisionAdmin } from '../src/lib/cms-schema';

const url=process.env['SUPABASE_URL'];
const key=process.env['SUPABASE_SERVICE_ROLE_KEY'];
const email=process.env['ADMIN_EMAIL'];
const reset=process.argv.includes('--reset-password');
if(!url || !key || !email) throw new Error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAIL are required.');
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
let existing;
for(let page=1;;page++){
  const {data,error}=await db.auth.admin.listUsers({page,perPage:1000});
  if(error) throw new Error('Could not inspect administrator accounts.');
  existing=data.users.find(u=>u.email?.toLowerCase()===email.toLowerCase());
  if(existing || data.users.length<1000)break;
}
let id=existing?.id;
if(canProvisionAdmin(Boolean(existing),reset)){
  const password=process.env['ADMIN_PASSWORD'] || (await Bun.stdin.text()).trim();
  if(password.length<12)throw new Error('Administrator password must contain at least 12 characters. Supply it securely using standard input or ADMIN_PASSWORD.');
  if(existing){
    const {error}=await db.auth.admin.updateUserById(existing.id,{password});
    if(error)throw new Error('Password reset failed.');
  }else{
    const {data,error}=await db.auth.admin.createUser({email,password,email_confirm:true});
    if(error || !data.user)throw new Error('Administrator creation failed.');
    id=data.user.id;
  }
}
if(!id)throw new Error('Administrator identifier is missing.');
const {error}=await db.from('user_roles').upsert({user_id:id,role:'admin'},{onConflict:'user_id,role'});
if(error)throw new Error('Could not assign administrator rights.');
console.log(existing?(reset?'Administrator password reset.':'Existing administrator preserved.'): 'Administrator created.');