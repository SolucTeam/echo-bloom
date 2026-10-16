import { describe, it, expect } from 'vitest';
import { pageSchema, safeLink, canProvisionAdmin } from './cms-schema';

describe('deployment administrator rules',()=>{
  it('preserves an existing account on repeated deployment',()=>expect(canProvisionAdmin(true,false)).toBe(false));
  it('creates an administrator when it does not exist',()=>expect(canProvisionAdmin(false,false)).toBe(true));
  it('only resets an existing password when explicitly requested',()=>expect(canProvisionAdmin(true,true)).toBe(true));
});
describe('CMS boundaries',()=>{
  it('rejects executable links',()=>expect(safeLink.safeParse('javascript:alert(1)').success).toBe(false));
  it('rejects protocol-relative external links',()=>expect(safeLink.safeParse('//evil.example').success).toBe(false));
  it('rejects backslash links that browsers treat as external URLs',()=>expect(safeLink.safeParse('/\\evil.example').success).toBe(false));
  it('requires an explicit publication decision',()=>expect(pageSchema.safeParse({path:'/test',title:'Test',description:'',share_image:'',blocks:[]}).success).toBe(false));
});