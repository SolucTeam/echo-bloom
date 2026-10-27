import { describe, expect, it } from 'vitest';
import { DEFAULT_CONTACT, DEFAULT_VOLUNTEER, contactSettingsSchema, volunteerSettingsSchema, volunteerApplication, contactSubmissionSchema, contactDetailsSchema, localizedContact, localizedVolunteer } from './form-settings';
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
describe('Localized form settings (phase 2 bilingue)',()=>{
  it('keeps the schema backward compatible with stored settings without English fields',()=>{
    expect(contactSettingsSchema.safeParse(DEFAULT_CONTACT).success).toBe(true);
    expect(volunteerSettingsSchema.safeParse(DEFAULT_VOLUNTEER).success).toBe(true);
  });
  it('returns the configuration unchanged in French',()=>{
    expect(localizedContact(DEFAULT_CONTACT,'fr')).toBe(DEFAULT_CONTACT);
    expect(localizedVolunteer(DEFAULT_VOLUNTEER,'fr')).toBe(DEFAULT_VOLUNTEER);
  });
  it('replaces each text with its English counterpart when filled',()=>{
    const view=localizedContact({...DEFAULT_CONTACT,formTitleEn:'Get in touch',descriptionEn:'   '},'en');
    expect(view.formTitle).toBe('Get in touch');
    expect(view.description).toBe(DEFAULT_CONTACT.description); // Champ EN vide : repli français.
    expect(view.buttonLabel).toBe(DEFAULT_CONTACT.buttonLabel); // Champ non traduit : repli français.
  });
  it('uses the English missions only when the list holds real entries',()=>{
    expect(localizedVolunteer({...DEFAULT_VOLUNTEER,missionsEn:['  ','']},'en').missions).toEqual(DEFAULT_VOLUNTEER.missions);
    expect(localizedVolunteer({...DEFAULT_VOLUNTEER,missionsEn:['Beach cleanups']},'en').missions).toEqual(['Beach cleanups']);
  });
  it('keeps server-side behavior on the French configuration',()=>{
    const view=localizedVolunteer({...DEFAULT_VOLUNTEER,formTitleEn:'Volunteer signup'},'en');
    expect(()=>volunteerApplication({name:'Ada',email:'ada@example.org',startedAt:0},{...view,enabled:false})).toThrow();
  });
});
