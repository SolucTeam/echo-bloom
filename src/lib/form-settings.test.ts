import { describe, expect, it } from 'vitest';
import { DEFAULT_CONTACT, DEFAULT_VOLUNTEER, contactSettingsSchema, volunteerSettingsSchema, volunteerApplication, contactSubmissionSchema, contactDetailsSchema } from './form-settings';
describe('Configurable contact and volunteer forms', () => {
  it('persists separate configuration for contact and volunteers', () => {
    expect(contactSettingsSchema.parse({...DEFAULT_CONTACT, enabled:false}).enabled).toBe(false);
    expect(volunteerSettingsSchema.parse({...DEFAULT_VOLUNTEER, enabled:true}).enabled).toBe(true);
  });
  it('refuses volunteer applications when closed', () => {
    expect(()=>volunteerApplication({name:'Ada',email:'ada@example.org',startedAt:0},{...DEFAULT_VOLUNTEER,enabled:false})).toThrow();
  });
  it('discards disabled optional volunteer fields', () => {
    const row=volunteerApplication({name:'Ada',email:'ada@example.org',phone:'123',city:'Abidjan',message:'Motivation',startedAt:0},{...DEFAULT_VOLUNTEER,showPhone:false,showCity:false,showMessage:false});
    expect(row).toMatchObject({kind:'benevole',phone:null,city:null,message:null,handled:false});
  });
  it('validates contact submissions', () => {
    expect(contactSubmissionSchema.safeParse({email:'invalid',subject:'Question',message:'Une question pour vous',startedAt:0}).success).toBe(false);
  });
  it('validates contact email settings',()=>{
    expect(contactDetailsSchema.shape['site.email'].safeParse('invalid').success).toBe(false);
  });
});
