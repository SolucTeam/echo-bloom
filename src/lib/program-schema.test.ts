import { describe, it, expect } from 'vitest';
import { programSchema, localizedProgram } from './program-schema';

const base={slug:'test-program',visible:true,title:'Programme test',eyebrow:'Emploi vert',tagline:'Résumé français',org:'Green Ivory',launched:'2021',pilot:'',firstEdition:'',goal:'Objectif français',goalDetail:'',hero:'',context:'',objectives:['Premier objectif'],outcomes:[{label:'participants',value:'120'}]};
function parse(value:unknown){return programSchema.safeParse(value);}

describe('program schema with optional English fields',()=>{
  it('accepts a program without any English field (existing data)',()=>expect(parse(base).success).toBe(true));
  it('accepts a program with complete English fields',()=>expect(parse({...base,titleEn:'Test program',objectivesEn:['First objective'],outcomesEn:[{label:'participants',value:'120'}]}).success).toBe(true));
  it('accepts partially filled English lists, unlike the French ones',()=>expect(parse({...base,objectivesEn:['First objective','']}).success).toBe(true));
  it('rejects an English list exceeding the French limit',()=>expect(parse({...base,objectivesEn:Array(31).fill('x')}).success).toBe(false));
});

describe('localized program view',()=>{
  it('returns the program unchanged in French',()=>expect(localizedProgram(base,'fr')).toEqual(base));
  it('replaces each field with its English counterpart when filled',()=>{
    const en=localizedProgram({...base,tagline:'French summary',titleEn:'Test program',taglineEn:'English summary',orgEn:'Green Ivory UK'},'en');
    expect(en.title).toBe('Test program');
    expect(en.tagline).toBe('English summary');
    expect(en.org).toBe('Green Ivory UK');
    expect(en.eyebrow).toBe('Emploi vert'); // Champ non traduit : repli français.
  });
  it('falls back field by field when English texts are blank or missing',()=>{
    const en=localizedProgram({...base,goalEn:'   ',objectivesEn:[],outcomesEn:[]},'en');
    expect(en.goal).toBe('Objectif français');
    expect(en.objectives).toEqual(['Premier objectif']);
    expect(en.outcomes).toEqual([{label:'participants',value:'120'}]);
  });
  it('keeps the French list when the English list holds only blank entries',()=>{
    const en=localizedProgram({...base,objectivesEn:['  ','']},'en');
    expect(en.objectives).toEqual(['Premier objectif']);
  });
  it('keeps the program address and visible flag across languages',()=>{
    const en=localizedProgram({...base,titleEn:'Test program'},'en');
    expect(en.slug).toBe('test-program');
    expect(en.visible).toBe(true);
  });
});
