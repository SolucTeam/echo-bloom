import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { provisionAdmin, assertPrivateSignup } from './provision-admin-core';
import { ensureNodeWebSocket } from '../src/lib/server-ws.server';

ensureNodeWebSocket();

const url=process.env['SUPABASE_URL'];
const key=process.env['SUPABASE_SERVICE_ROLE_KEY'];
const email=process.env['ADMIN_EMAIL'];
const publicKey=process.env['SUPABASE_PUBLISHABLE_KEY'];
const reset=process.argv.includes('--reset-password');
try {
  if(!url || !key || !email || !publicKey) throw new Error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PUBLISHABLE_KEY and ADMIN_EMAIL are required.');
  if(!z.string().email().safeParse(email).success)throw new Error('ADMIN_EMAIL must be a valid email address.');
  const settings=await fetch(`${url.replace(/\/$/,'')}/auth/v1/settings`,{headers:{apikey:publicKey},signal:AbortSignal.timeout(15000)});
  if(!settings.ok)throw new Error('Authentication settings could not be verified. Check the local API and public key.');
  assertPrivateSignup(await settings.json());
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const result=await provisionAdmin(db,email,async()=>{
    const file=process.env['ADMIN_PASSWORD_FILE'];
    if(file)return (await readFile(file,'utf8')).replace(/\r?\n$/,'');
    return process.env['ADMIN_PASSWORD'] || (await Bun.stdin.text()).replace(/\r?\n$/,'');
  },reset);
  console.log(result);
}catch(error){
  // Do not print provider responses, credential values or request details.
  console.error(error instanceof Error && !('code' in error) ? error.message : 'Administrator setup failed.');
  process.exitCode=1;
}