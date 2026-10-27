import { describe, it, expect } from 'vitest';
import { localizedHomeTexts, localizedHomeStats } from './home';
import { localizedAboutTexts } from './about';
import { enText } from '@/lib/i18n';

describe('localized home texts',()=>{
  it('returns the French texts unchanged in French',()=>{
    const fr={'home.axis.title':'Titre français'};
    expect(localizedHomeTexts(fr,{'home.axis.title':'English title'},'fr')).toBe(fr);
  });
  it('replaces each text with its English counterpart when filled',()=>{
    const merged=localizedHomeTexts({'home.axis.title':'Titre français','home.values.title':'Valeurs'},{'home.axis.title':'English title'},'en');
    expect(merged['home.axis.title']).toBe('English title');
    expect(merged['home.values.title']).toBe('Valeurs'); // Champ non traduit : repli français.
  });
  it('keeps the French text when the English one is blank, and surfaces English-only keys',()=>{
    const merged=localizedHomeTexts({'home.axis.title':'Titre français'},{'home.axis.title':'  ','home.hero.eyebrow':'Green jobs'},'en');
    expect(merged['home.axis.title']).toBe('Titre français');
    expect(merged['home.hero.eyebrow']).toBe('Green jobs');
  });
  it('falls back to French when no English texts exist',()=>{
    const fr={'home.axis.title':'Titre français'};
    expect(localizedHomeTexts(fr,undefined,'en')).toEqual(fr);
  });
});

describe('localized about texts',()=>{
  it('replaces each text with its English counterpart when filled',()=>{
    const merged=localizedAboutTexts({'about.mission.text':'Mission française'},{'about.mission.text':'French mission in English'},'en');
    expect(merged['about.mission.text']).toBe('French mission in English');
  });
  it('keeps the French text when the English one is missing',()=>{
    expect(localizedAboutTexts({'about.mission.text':'Mission française'},undefined,'en')).toEqual({'about.mission.text':'Mission française'});
  });
});

describe('localized home stats',()=>{
  const stats=[
    {value:'200 000+',label:'déchets ramassés',labelEn:'pieces of litter collected'},
    {value:'12',label:'collectes organisées'},
  ];
  it('keeps the French legends unchanged in French',()=>{
    expect(localizedHomeStats(stats,'fr')).toEqual(stats);
  });
  it('replaces each legend with its English one when filled',()=>{
    expect(localizedHomeStats(stats,'en')[0].label).toBe('pieces of litter collected');
  });
  it('falls back to the French legend when blank or missing',()=>{
    const localized=localizedHomeStats(stats,'en');
    expect(localized[1].label).toBe('collectes organisées');
    expect(localizedHomeStats([{value:'5',label:'arbres',labelEn:'  '}],'en')[0].label).toBe('arbres');
  });
});

describe('enText',()=>{
  it('returns the English dictionary text of a key',()=>{
    expect(enText('programs.title')).toBe('Our programs');
  });
});
