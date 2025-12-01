// === CONSTANTS ===
const E={PHYS:0,POISON:1,FIRE:2,WATER:3,LIGHT:4,DARK:5,EARTH:6,LIGHTNING:7},
EN=["Physical","Poison","Fire","Water","Light","Dark","Earth","Lightning"],
EC=["#a0a0a0","#7ee04d","#ff6633","#4d99ff","#ffffa0","#9966cc","#996633","#ffff4d"],
R={RUSTY:-1,COMMON:0,UNCOMMON:2,MAGIC:2,RARE:3,EPIC:3,LEGENDARY:3}, // T1=COMMON(0), T2=UNCOMMON/MAGIC(2), T3=RARE/EPIC/LEGENDARY(3)
RN=["T1","T1","T2","T3"],
RC=["rarity-common","rarity-common","rarity-magic","rarity-rare"],
RRANK=[0,1,2,3,3,3], // Rarity ranks: 0=T1, 2=T2, 3=T3, EPIC=3, LEGENDARY=3
TYPE_ORDER={weapon:0,affinity:1,adjective:2,noun:3};

// Maximum inventory size to prevent hoarding too many words
// Increase inventory limit so players can hold more words
const INV_LIMIT=30;
// Cap how many consumables can be held at once to keep power in check
const CONSUMABLE_LIMIT=2;
// Talents are disabled for this build; keep the limit at zero to prevent acquisition.
const BUFF_LIMIT=0;

// === 8 HEROES ===
const HEROES=[
  {
    id:"warrior",
    name:"Alaric the Ironwill",
    hp:100,
    str:[E.PHYS,E.EARTH],
    weak:[E.POISON,E.DARK],
    good:"slash",
    bad:"magic",
    desc:"A stoic warrior forged in countless battles. His unwavering resolve makes him a formidable ally.",
    dialogue:[
      "Greetings, Wordsmith. I require a weapon worthy of this battle.",
      "Forge me something strong. I shall not falter.",
      "Another foe? Good. My blade grows restless."
    ]
  },
  {
    id:"ranger",
    name:"Selene Swiftarrow",
    hp:100,
    str:[E.LIGHTNING,E.LIGHT],
    weak:[E.EARTH,E.DARK],
    good:"pierce",
    bad:"blunt",
    desc:"A nimble huntress who channels storm and starlight. Her arrows strike true.",
    dialogue:[
      "Swift greetings! Let's make something electrifying.",
      "The wind whispers of danger. Arm me well!",
      "Ooh, this one looks tough! I love a challenge."
    ]
  },
  {
    id:"mage",
    name:"Lyra Emberheart",
    hp:100,
    str:[E.FIRE,E.LIGHT],
    weak:[E.WATER,E.PHYS],
    good:"magic",
    bad:"slash",
    desc:"A brilliant pyromancer whose flames dance with destruction and beauty.",
    dialogue:[
      "Wordsmith! Let us craft something that BURNS.",
      "Fire cleanses all. Make me an instrument of purification.",
      "Mmm, I sense powerful words nearby..."
    ]
  },
  {
    id:"paladin",
    name:"Theron the Radiant",
    hp:100,
    str:[E.LIGHT,E.PHYS],
    weak:[E.DARK,E.POISON],
    good:"blunt",
    bad:"pierce",
    desc:"A holy knight blessed by divine light. His oaths shield the innocent.",
    dialogue:[
      "By the light! I need a holy weapon.",
      "Evil approaches. Together, we shall vanquish it.",
      "The darkness will fall before our might!"
    ]
  },
  {
    id:"assassin",
    name:"Vex Shadowmend",
    hp:100,
    str:[E.DARK,E.POISON],
    weak:[E.LIGHT,E.FIRE],
    good:"pierce",
    bad:"blunt",
    desc:"A deadly shadow who strikes from darkness. Poisons are her companions.",
    dialogue:[
      "Shhh... they won't see it coming.",
      "Craft me something subtle. And lethal.",
      "The shadows hunger. Feed them."
    ]
  },
  {
    id:"druid",
    name:"Oakheart the Ancient",
    hp:100,
    str:[E.EARTH,E.WATER],
    weak:[E.FIRE,E.LIGHTNING],
    good:"blunt",
    bad:"magic",
    desc:"An ancient guardian of the forest. Commands stone and tide.",
    dialogue:[
      "The earth speaks... it demands balance.",
      "Nature provides. Now let us take.",
      "Root and stone shall be our weapons."
    ]
  }
];

// === 8 ENEMIES ===
const ENEMIES=[
  {id:"frost",name:"Frostbone Colossus",hp:100,ap:24,weak:[E.FIRE,E.LIGHTNING],res:[E.WATER,E.DARK],atk:E.WATER,
   desc:"An ancient undead giant encased in eternal ice.",dialogue:["CRRREAAAK... WARM BLOOD...","YOUR HEAT... WILL FADE..."]},
  {id:"hydra",name:"Venomwilt Hydra",hp:80,ap:22,weak:[E.FIRE,E.LIGHT],res:[E.POISON,E.WATER],atk:E.POISON,
   desc:"A writhing mass of serpentine heads dripping with toxins.",dialogue:["Hssss... another morsel...","Three headsss, three deathsss..."]},
  {id:"shade",name:"Shadewoven Matriarch",hp:70,ap:28,weak:[E.LIGHT,E.FIRE],res:[E.DARK,E.POISON],atk:E.DARK,
   desc:"A void-touched spider queen who weaves darkness itself.",dialogue:["Come, little fly... my web awaits...","The void hungers..."]},
  {id:"golem",name:"Ironclad Golem",hp:120,ap:20,weak:[E.LIGHTNING,E.WATER],res:[E.EARTH,E.PHYS],atk:E.PHYS,
   desc:"A mechanical titan of gears and ancient runes.",dialogue:["DIRECTIVE: ELIMINATE.","COMBAT: INITIATED."]},
  {id:"phoenix",name:"Ashborn Phoenix",hp:75,ap:26,weak:[E.WATER,E.EARTH],res:[E.FIRE,E.LIGHT],atk:E.FIRE,
   desc:"A blazing bird of eternal flame.",dialogue:["SCREEEEE! BURN!","From ash YOU fall!"]},
  {id:"lich",name:"Vazreth the Undying",hp:85,ap:25,weak:[E.LIGHT,E.PHYS],res:[E.DARK,E.POISON],atk:E.DARK,
   desc:"An ancient sorcerer who conquered death itself.",dialogue:["Death is merely... an inconvenience.","Your soul will join my collection."]},
  {id:"elemental",name:"Stormcore Elemental",hp:90,ap:23,weak:[E.EARTH,E.DARK],res:[E.LIGHTNING,E.WATER],atk:E.LIGHTNING,
   desc:"Pure elemental fury given form.",dialogue:["CRACKLE... OBLITERATE!","THE STORM CANNOT BE CONTAINED!"]},
  {id:"treant",name:"Blightwood Treant",hp:130,ap:18,weak:[E.FIRE,E.POISON],res:[E.EARTH,E.WATER],atk:E.EARTH,
   desc:"A corrupted forest guardian twisted by dark magic.",dialogue:["The forest... remembers...","You will feed... the roots..."]}
];

// Talents are retired for this build to simplify balance.
const TALENTS=[];

// === CONSUMABLES (one-time use) ===
const CONSUMABLES=[
  // Heal consumables have been removed in the simplified model where hero HP is not tracked
  {id:"one_day_delivery",name:"One-Day Delivery",cost:20,desc:"Generate a random Rare word and add to inventory.",
   use:(S)=>{
     const pool=WORDS.filter(w=>w.rarity===R.RARE);
     if(pool.length>0){
       if(S.inv.length>=INV_LIMIT){
         return "Inventory full! Cannot add new word.";
       }
       const w=pool[Math.random()*pool.length|0];
       S.inv.push({...w});
       return `Generated ${w.name}!`;
     }
     return "No Rare words available.";
   }},
  {id:"weapon_master_consumable",name:"Weapon Master (1 battle)",cost:10,desc:"Activate to double weapon proficiency for one battle.",
   use:(S)=>{S.tempEffects.weaponMaster=true;return "Weapon Master active!"}},
  {id:"quality_assurance",name:"Quality Assurance",cost:15,desc:"Upgrade a selected word by one tier for this run.",
   use:(S)=>{
     const target=S.sel.item||S.sel.noun1||S.sel.adj1||S.sel.adj2||S.sel.adj3||S.sel.adj4||S.inv[0];
     if(!target) return "No word to upgrade.";
     const nextTierWord=findNextTierWord(target);
     if(!nextTierWord){
       return `${target.name} is already top tier.`;
     }
     applyWordUpgrade(target,nextTierWord);
     return `${target.name} refined!`;
   }},
  {id:"polymorph",name:"Polymorph",cost:12,desc:"Use to strip enemy resistances for your next battle.",
   use:(S)=>{S.tempEffects.polymorph=true;return "Enemy resistances nullified!"}}
];

// === WORDS ===
const WORDS=[
  // Affinities (Adj₁ for weapons) - ALL ELEMENTS
  {id:"fiery",name:"Fiery",type:"affinity",elem:E.FIRE,rarity:R.COMMON,desc:"Fire element."},
  {id:"frozen",name:"Frozen",type:"affinity",elem:E.WATER,rarity:R.COMMON,desc:"Water element."},
  {id:"toxic",name:"Toxic",type:"affinity",elem:E.POISON,rarity:R.COMMON,desc:"Poison element."},
  {id:"holy",name:"Holy",type:"affinity",elem:E.LIGHT,rarity:R.COMMON,desc:"Light element."},
  {id:"shadowed",name:"Shadowed",type:"affinity",elem:E.DARK,rarity:R.COMMON,desc:"Dark element."},
  {id:"earthen",name:"Earthen",type:"affinity",elem:E.EARTH,rarity:R.COMMON,desc:"Earth element."},
  {id:"charged",name:"Charged",type:"affinity",elem:E.LIGHTNING,rarity:R.COMMON,desc:"Lightning element."},
  {id:"brutal",name:"Brutal",type:"affinity",elem:E.PHYS,rarity:R.COMMON,desc:"Physical element."},
  // Weapons organized by category: Slash, Pierce, Blunt, Magic (3 tiers each)
  // Slash weapons (T1, T2, T3)
  {id:"sword",name:"Sword",type:"weapon",category:"slash",rarity:R.COMMON,desc:"A balanced blade."},
  {id:"greatsword",name:"Greatsword",type:"weapon",category:"slash",rarity:R.UNCOMMON,desc:"A powerful two-handed sword."},
  {id:"claymore",name:"Claymore",type:"weapon",category:"slash",rarity:R.RARE,desc:"A legendary Highland blade."},
  // Pierce weapons (T1, T2, T3)
  {id:"bow",name:"Bow",type:"weapon",category:"pierce",rarity:R.COMMON,desc:"A ranged weapon."},
  {id:"longbow",name:"Longbow",type:"weapon",category:"pierce",rarity:R.UNCOMMON,desc:"A powerful ranged weapon."},
  {id:"warbow",name:"Warbow",type:"weapon",category:"pierce",rarity:R.RARE,desc:"A masterwork bow of immense power."},
  // Magic weapons (T1, T2, T3)
  {id:"wand",name:"Wand",type:"weapon",category:"magic",rarity:R.COMMON,desc:"A simple magical focus."},
  {id:"staff",name:"Staff",type:"weapon",category:"magic",rarity:R.UNCOMMON,desc:"A powerful channeling staff."},
  {id:"scepter",name:"Scepter",type:"weapon",category:"magic",rarity:R.RARE,desc:"A royal arcane artifact."},
  // Blunt weapons (T1, T2, T3)
  {id:"mace",name:"Mace",type:"weapon",category:"blunt",rarity:R.COMMON,desc:"A heavy bludgeon."},
  {id:"warhammer",name:"Warhammer",type:"weapon",category:"blunt",rarity:R.UNCOMMON,desc:"A crushing war weapon."},
  {id:"maul",name:"Maul",type:"weapon",category:"blunt",rarity:R.RARE,desc:"A massive two-handed hammer."},
  // Adjectives - Pure multipliers (rarity-themed progression)
  {id:"adj_common",name:"Common",type:"adjective",mult:1.1,rarity:R.COMMON,desc:"×1.1 multiplier."},
  {id:"adj_uncommon",name:"Uncommon",type:"adjective",mult:1.2,rarity:R.UNCOMMON,desc:"×1.2 multiplier."},
  {id:"adj_magic",name:"Magic",type:"adjective",mult:1.3,rarity:R.MAGIC,desc:"×1.3 multiplier."},
  {id:"adj_rare",name:"Rare",type:"adjective",mult:1.4,rarity:R.RARE,desc:"×1.4 multiplier."},
  {id:"adj_epic",name:"Epic",type:"adjective",mult:1.5,rarity:R.EPIC,desc:"×1.5 multiplier."},
  {id:"adj_legendary",name:"Legendary",type:"adjective",mult:2.0,rarity:R.LEGENDARY,desc:"×2.0 multiplier."},
  // Adjectives - Elemental (ALL ELEMENTS, 3 tiers each)
  {id:"blazing",name:"Blazing",type:"adjective",mult:1.4,elem:E.FIRE,rarity:R.COMMON,desc:"Fire. ×1.4",hiddenInBank:true},
  {id:"scorching",name:"Scorching",type:"adjective",mult:1.7,elem:E.FIRE,rarity:R.UNCOMMON,desc:"Fire. ×1.7",hiddenInBank:true},
  {id:"infernal",name:"Infernal",type:"adjective",mult:2.1,elem:E.FIRE,rarity:R.MAGIC,desc:"Fire. ×2.1",hiddenInBank:true},
  {id:"frigid",name:"Frigid",type:"adjective",mult:1.4,elem:E.WATER,rarity:R.COMMON,desc:"Water. ×1.4",hiddenInBank:true},
  {id:"glacial",name:"Glacial",type:"adjective",mult:1.7,elem:E.WATER,rarity:R.UNCOMMON,desc:"Water. ×1.7",hiddenInBank:true},
  {id:"oceanic",name:"Oceanic",type:"adjective",mult:2.1,elem:E.WATER,rarity:R.MAGIC,desc:"Water. ×2.1",hiddenInBank:true},
  {id:"venomous",name:"Venomous",type:"adjective",mult:1.4,elem:E.POISON,rarity:R.COMMON,desc:"Poison. ×1.4",hiddenInBank:true},
  {id:"noxious",name:"Noxious",type:"adjective",mult:1.7,elem:E.POISON,rarity:R.UNCOMMON,desc:"Poison. ×1.7",hiddenInBank:true},
  {id:"virulent",name:"Virulent",type:"adjective",mult:2.1,elem:E.POISON,rarity:R.MAGIC,desc:"Poison. ×2.1",hiddenInBank:true},
  {id:"radiant",name:"Radiant",type:"adjective",mult:1.4,elem:E.LIGHT,rarity:R.COMMON,desc:"Light. ×1.4",hiddenInBank:true},
  {id:"luminous",name:"Luminous",type:"adjective",mult:1.7,elem:E.LIGHT,rarity:R.UNCOMMON,desc:"Light. ×1.7",hiddenInBank:true},
  {id:"celestial",name:"Celestial",type:"adjective",mult:2.1,elem:E.LIGHT,rarity:R.MAGIC,desc:"Light. ×2.1",hiddenInBank:true},
  {id:"cursed",name:"Cursed",type:"adjective",mult:1.4,elem:E.DARK,rarity:R.COMMON,desc:"Dark. ×1.4",hiddenInBank:true},
  {id:"sinister",name:"Sinister",type:"adjective",mult:1.7,elem:E.DARK,rarity:R.UNCOMMON,desc:"Dark. ×1.7",hiddenInBank:true},
  {id:"void",name:"Void",type:"adjective",mult:2.1,elem:E.DARK,rarity:R.MAGIC,desc:"Dark. ×2.1",hiddenInBank:true},
  {id:"rugged",name:"Rugged",type:"adjective",mult:1.4,elem:E.EARTH,rarity:R.COMMON,desc:"Earth. ×1.4",hiddenInBank:true},
  {id:"granite",name:"Granite",type:"adjective",mult:1.7,elem:E.EARTH,rarity:R.UNCOMMON,desc:"Earth. ×1.7",hiddenInBank:true},
  {id:"seismic",name:"Seismic",type:"adjective",mult:2.1,elem:E.EARTH,rarity:R.MAGIC,desc:"Earth. ×2.1",hiddenInBank:true},
  {id:"voltaic",name:"Voltaic",type:"adjective",mult:1.4,elem:E.LIGHTNING,rarity:R.COMMON,desc:"Lightning. ×1.4",hiddenInBank:true},
  {id:"electric",name:"Electric",type:"adjective",mult:1.7,elem:E.LIGHTNING,rarity:R.UNCOMMON,desc:"Lightning. ×1.7",hiddenInBank:true},
  {id:"thunderous",name:"Thunderous",type:"adjective",mult:2.1,elem:E.LIGHTNING,rarity:R.MAGIC,desc:"Lightning. ×2.1",hiddenInBank:true},
  {id:"savage",name:"Savage",type:"adjective",mult:1.4,elem:E.PHYS,rarity:R.COMMON,desc:"Physical. ×1.4",hiddenInBank:true},
  {id:"vicious",name:"Vicious",type:"adjective",mult:1.7,elem:E.PHYS,rarity:R.UNCOMMON,desc:"Physical. ×1.7",hiddenInBank:true},
  {id:"devastating",name:"Devastating",type:"adjective",mult:2.1,elem:E.PHYS,rarity:R.MAGIC,desc:"Physical. ×2.1",hiddenInBank:true},
  // Nouns (Gems) - ALL ELEMENTS, 3 tiers each
  {id:"ember",name:"Ember",type:"noun",elem:E.FIRE,ap:1,rarity:R.COMMON,desc:"+1 AP Fire"},
  {id:"flame",name:"Flame",type:"noun",elem:E.FIRE,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Fire"},
  {id:"inferno",name:"Inferno",type:"noun",elem:E.FIRE,ap:3,rarity:R.RARE,desc:"+3 AP Fire"},
  {id:"wave",name:"Wave",type:"noun",elem:E.WATER,ap:1,rarity:R.COMMON,desc:"+1 AP Water"},
  {id:"torrent",name:"Torrent",type:"noun",elem:E.WATER,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Water"},
  {id:"tsunami",name:"Tsunami",type:"noun",elem:E.WATER,ap:3,rarity:R.RARE,desc:"+3 AP Water"},
  {id:"venom",name:"Venom",type:"noun",elem:E.POISON,ap:1,rarity:R.COMMON,desc:"+1 AP Poison"},
  {id:"toxin",name:"Toxin",type:"noun",elem:E.POISON,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Poison"},
  {id:"plague",name:"Plague",type:"noun",elem:E.POISON,ap:3,rarity:R.RARE,desc:"+3 AP Poison"},
  {id:"radiance",name:"Radiance",type:"noun",elem:E.LIGHT,ap:1,rarity:R.COMMON,desc:"+1 AP Light"},
  {id:"glory",name:"Glory",type:"noun",elem:E.LIGHT,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Light"},
  {id:"divinity",name:"Divinity",type:"noun",elem:E.LIGHT,ap:3,rarity:R.RARE,desc:"+3 AP Light"},
  {id:"darkness",name:"Darkness",type:"noun",elem:E.DARK,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Dark"},
  {id:"oblivion",name:"Oblivion",type:"noun",elem:E.DARK,ap:3,rarity:R.RARE,desc:"+3 AP Dark"},
  // Added T1 Dark noun so each element has 3 tiers
  {id:"shade",name:"Shade",type:"noun",elem:E.DARK,ap:1,rarity:R.COMMON,desc:"+1 AP Dark"},
  {id:"stone",name:"Stone",type:"noun",elem:E.EARTH,ap:1,rarity:R.COMMON,desc:"+1 AP Earth"},
  {id:"boulder",name:"Boulder",type:"noun",elem:E.EARTH,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Earth"},
  {id:"mountain",name:"Mountain",type:"noun",elem:E.EARTH,ap:3,rarity:R.RARE,desc:"+3 AP Earth"},
  {id:"spark",name:"Spark",type:"noun",elem:E.LIGHTNING,ap:1,rarity:R.COMMON,desc:"+1 AP Lightning"},
  {id:"bolt",name:"Bolt",type:"noun",elem:E.LIGHTNING,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Lightning"},
  {id:"tempest",name:"Tempest",type:"noun",elem:E.LIGHTNING,ap:3,rarity:R.RARE,desc:"+3 AP Lightning"},
  {id:"impact",name:"Impact",type:"noun",elem:E.PHYS,ap:1,rarity:R.COMMON,desc:"+1 AP Physical"},
  {id:"force",name:"Force",type:"noun",elem:E.PHYS,ap:2,rarity:R.UNCOMMON,desc:"+2 AP Physical"},
  {id:"cataclysm",name:"Cataclysm",type:"noun",elem:E.PHYS,ap:3,rarity:R.RARE,desc:"+3 AP Physical"}];

// === Morphological mapping ===
// Some words can morph between noun and adjective forms depending on which slot they occupy. To
// support this, define explicit mappings from nouns to adjectives and back again. Rather than
// relying on rarity matching (which breaks for tier‑3 words), we manually pair each noun with
// a suitable adjective of the same element. This gives players predictable transformations like
// Flame → Scorching and Inferno → Infernal even when the rarities differ.
const NOUN_TO_ADJ = {
  // Fire nouns
  ember: 'Blazing',
  flame: 'Scorching',
  inferno: 'Infernal',
  // Water nouns
  wave: 'Frigid',
  torrent: 'Glacial',
  tsunami: 'Oceanic',
  // Poison nouns
  venom: 'Venomous',
  toxin: 'Noxious',
  plague: 'Virulent',
  // Light nouns
  radiance: 'Radiant',
  glory: 'Luminous',
  divinity: 'Celestial',
  // Dark nouns
  darkness: 'Sinister',
  oblivion: 'Void',
  shade: 'Cursed',
  // Earth nouns
  stone: 'Rugged',
  boulder: 'Granite',
  mountain: 'Seismic',
  // Lightning nouns
  spark: 'Voltaic',
  bolt: 'Electric',
  tempest: 'Thunderous',
  // Physical nouns
  impact: 'Savage',
  force: 'Vicious',
  cataclysm: 'Devastating'
};

// Build the reverse mapping from adjectives back to nouns. This allows adjectives dropped into
// gem slots to revert to their noun form. Only adjectives that have a corresponding noun are
// included; other adjectives (e.g. Common, Epic) remain unchanged when placed in noun slots.
const ADJ_TO_NOUN = {};
Object.entries(NOUN_TO_ADJ).forEach(([nounId, adjName]) => {
  ADJ_TO_NOUN[adjName] = WORDS.find(w => w.type === 'noun' && w.id === nounId)?.name || nounId;
});

// === Word forms ===
// Define prefix and suffix forms for every non-weapon word.  The prefix form is used
// whenever a word occupies an adjective slot (before the weapon or after the gem), and
// the suffix form is used when the word sits in the gem slot.  Weapons always use
// their own name in any position.  Manual overrides provide clear transformations
// for base affinities and general adjectives.  For nouns, prefix forms come from
// NOUN_TO_ADJ; for adjectives, suffix forms come from ADJ_TO_NOUN or a matching
// element/rarity noun when available.  If no special mapping exists, the word
// retains its name for both positions.
const WORD_FORMS = {};
(() => {
  // Manual overrides for affinities and basic adjectives.  Each entry maps a word ID
  // to explicit prefix (adjective) and suffix (noun) forms.  These cover cases like
  // Fiery→Fire, Frozen→Ice, Shadowed→Shadowy/Shadow, etc.  If a word ID appears here
  // it will override any automatic mapping.
  const MANUAL_MORPHS = {
    fiery: { prefix: "Fiery", suffix: "Fire" },
    frozen: { prefix: "Icy", suffix: "Ice" },
    toxic: { prefix: "Toxic", suffix: "Poison" },
    holy: { prefix: "Holy", suffix: "Light" },
    shadowed: { prefix: "Shadowy", suffix: "Shade" },
    earthen: { prefix: "Earthen", suffix: "Stone" },
    charged: { prefix: "Charged", suffix: "Spark" },
    brutal: { prefix: "Brutal", suffix: "Impact" },
  };
  WORDS.forEach(w => {
    // Weapons retain their own name regardless of position
    if(w.type === 'weapon'){
      WORD_FORMS[w.id] = { prefix: w.name, suffix: w.name };
      return;
    }
    // Manual override takes precedence
    const override = MANUAL_MORPHS[w.id];
    if(override){
      WORD_FORMS[w.id] = { prefix: override.prefix, suffix: override.suffix };
      return;
    }
    // Nouns: use the paired adjective for prefix and original name for suffix
    if(w.type === 'noun'){
      const adjName = NOUN_TO_ADJ[w.id];
      WORD_FORMS[w.id] = { prefix: adjName || w.name, suffix: w.name };
      return;
    }
    // Adjectives or affinities: prefix defaults to the word's own name
    // Suffix uses the reverse mapping if available
    let suffix = ADJ_TO_NOUN[w.name];
    if(!suffix){
      // Try to find a noun with the same element and rarity for a reasonable
      // suffix when ADJ_TO_NOUN doesn't define one.  This helps map element
      // adjectives like Radiant→Radiance or Electric→Bolt.  Only consider nouns
      // with matching element and rarity.
      const nounCandidate = WORDS.find(n =>
        n.type === 'noun' && n.elem !== undefined && w.elem !== undefined &&
        n.elem === w.elem && RRANK[n.rarity] === RRANK[w.rarity]
      );
      suffix = nounCandidate ? nounCandidate.name : w.name;
    }
    WORD_FORMS[w.id] = { prefix: w.name, suffix };
  });
})();


const STICK={id:"stick",name:"Stick",type:"weapon",rarity:R.RUSTY,isStick:true,desc:"A pathetic twig. ×0.25 damage penalty."};

// === TALENTS ===
// Duplicate talent definition removed.  The primary TALENTS list is declared earlier in the file.

// === HELPER FUNCTIONS ===
function getTierRank(word){
  if(!word) return 0;
  const rank = RRANK[word.rarity];
  return rank !== undefined ? rank : 0;
}

function findNextTierWord(word){
  if(!word) return null;
  const targetRank = getTierRank(word);
  const candidates = WORDS
    .filter(w => {
      if(w.type !== word.type) return false;
      if(word.type === 'weapon') return w.category === word.category;
      if(word.elem !== undefined) return w.elem === word.elem;
      return w.elem === undefined;
    })
    .sort((a,b) => {
      const ra = getTierRank(a);
      const rb = getTierRank(b);
      if(ra !== rb) return ra - rb;
      return WORDS.indexOf(a) - WORDS.indexOf(b);
    });
  return candidates.find(w => getTierRank(w) > targetRank) || null;
}

function applyWordUpgrade(target,template){
  if(!target || !template) return;
  const upgraded = {...template};
  Object.keys(target).forEach(k => delete target[k]);
  Object.assign(target, upgraded);
}

// Convert a rarity into a base AP value.  Tier 1 words grant 1 AP, Tier 2 words grant 2 AP,
// and Tier 3 words grant 3 AP.  Ranks are determined via the RRANK array (0=T1, 2=T2, 3=T3).
function rarityToAP(rarity){
  const rank = (rarity !== undefined && RRANK[rarity] !== undefined) ? RRANK[rarity] : 0;
  if(rank === 0) return 1;
  if(rank === 2) return 2;
  if(rank >= 3) return 3;
  // Fallback for unusual ranks
  return rank + 1;
}

// Determine the base AP for a given word.  If the word defines an explicit 'ap' property
// (e.g. gem nouns), use that value.  Otherwise, derive the AP from its rarity.
function getBaseAP(word){
  if(!word) return 0;
  if(word.ap !== undefined) return word.ap;
  return rarityToAP(word.rarity);
}

// === WEAPON SVG ===
const WEAPON_SVG={
  // SLASH CATEGORY
  sword:{base:`<path d="M50 10 L55 15 L55 85 L60 90 L60 100 L55 100 L55 105 L60 110 L60 120 L40 120 L40 110 L45 105 L45 100 L40 100 L40 90 L45 85 L45 15 Z" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/><path d="M50 15 L52 20 L52 80 L50 82 L48 80 L48 20 Z" fill="#ffffff33"/>`,flair1:`<circle cx="50" cy="95" r="4" fill="FLAIR1COLOR"/>`,flair2:`<path d="M35 25 L30 20 M65 25 L70 20 M35 35 L28 33 M65 35 L72 33" stroke="FLAIR2COLOR" stroke-width="2" stroke-linecap="round"/>`},
  greatsword:{base:`<path d="M50 5 L58 12 L58 82 L62 88 L62 100 L58 100 L58 107 L62 112 L62 120 L38 120 L38 112 L42 107 L42 100 L38 100 L38 88 L42 82 L42 12 Z" fill="BASECOLOR" stroke="#333" stroke-width="2"/><path d="M50 10 L54 16 L54 78 L50 82 L46 78 L46 16 Z" fill="#ffffff33"/><rect x="36" y="88" width="28" height="5" fill="#333"/>`,flair1:`<circle cx="50" cy="96" r="5" fill="FLAIR1COLOR"/>`,flair2:`<path d="M32 22 L26 17 M68 22 L74 17 M32 38 L24 35 M68 38 L76 35" stroke="FLAIR2COLOR" stroke-width="2.5" stroke-linecap="round"/>`},
  claymore:{base:`<path d="M50 3 L60 10 L60 80 L65 86 L65 98 L60 98 L60 106 L65 112 L65 122 L35 122 L35 112 L40 106 L40 98 L35 98 L35 86 L40 80 L40 10 Z" fill="BASECOLOR" stroke="#333" stroke-width="2.5"/><path d="M50 8 L56 14 L56 76 L50 82 L44 76 L44 14 Z" fill="#ffffff44"/><rect x="33" y="86" width="34" height="6" fill="#444"/><path d="M25 15 L35 10 M75 15 L65 10" stroke="BASECOLOR" stroke-width="4"/>`,flair1:`<circle cx="50" cy="96" r="6" fill="FLAIR1COLOR"/><circle cx="50" cy="108" r="4" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="30" cy="20" r="5" fill="FLAIR2COLOR"/><circle cx="70" cy="20" r="5" fill="FLAIR2COLOR"/><circle cx="28" cy="40" r="4" fill="FLAIR2COLOR"/><circle cx="72" cy="40" r="4" fill="FLAIR2COLOR"/>`},

  // PIERCE CATEGORY
  bow:{base:`<path d="M50 10 Q20 65 50 120 Q80 65 50 10" fill="none" stroke="BASECOLOR" stroke-width="6" stroke-linecap="round"/><path d="M50 10 Q25 65 50 120" fill="none" stroke="#ffffff22" stroke-width="3"/><line x1="50" y1="15" x2="50" y2="115" stroke="#c9a227" stroke-width="1.5"/>`,flair1:`<circle cx="50" cy="65" r="6" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="50" cy="25" r="4" fill="FLAIR2COLOR"/><circle cx="50" cy="105" r="4" fill="FLAIR2COLOR"/>`},
  longbow:{base:`<path d="M50 5 Q15 65 50 125 Q85 65 50 5" fill="none" stroke="BASECOLOR" stroke-width="7" stroke-linecap="round"/><path d="M50 5 Q20 65 50 125" fill="none" stroke="#ffffff22" stroke-width="4"/><line x1="50" y1="10" x2="50" y2="120" stroke="#c9a227" stroke-width="2"/><circle cx="50" cy="10" r="3" fill="#c9a227"/><circle cx="50" cy="120" r="3" fill="#c9a227"/>`,flair1:`<circle cx="50" cy="65" r="7" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="50" cy="30" r="5" fill="FLAIR2COLOR"/><circle cx="50" cy="100" r="5" fill="FLAIR2COLOR"/>`},
  warbow:{base:`<path d="M50 3 Q10 65 50 127 Q90 65 50 3" fill="none" stroke="BASECOLOR" stroke-width="8" stroke-linecap="round"/><path d="M50 3 Q15 65 50 127" fill="none" stroke="#ffffff33" stroke-width="5"/><line x1="50" y1="8" x2="50" y2="122" stroke="#d4a532" stroke-width="2.5"/><path d="M45 8 L50 3 L55 8" fill="#d4a532"/><path d="M45 122 L50 127 L55 122" fill="#d4a532"/><rect x="48" y="60" width="4" height="10" fill="#c9a227"/>`,flair1:`<circle cx="50" cy="65" r="8" fill="FLAIR1COLOR"/><circle cx="50" cy="50" r="4" fill="FLAIR1COLOR"/><circle cx="50" cy="80" r="4" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="50" cy="20" r="6" fill="FLAIR2COLOR"/><circle cx="50" cy="110" r="6" fill="FLAIR2COLOR"/><circle cx="40" cy="65" r="4" fill="FLAIR2COLOR"/><circle cx="60" cy="65" r="4" fill="FLAIR2COLOR"/>`},

  // MAGIC CATEGORY
  wand:{base:`<rect x="48" y="60" width="4" height="60" fill="#6d5b43" stroke="#3a2a1a" stroke-width="1"/><circle cx="50" cy="25" r="18" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/><circle cx="50" cy="25" r="10" fill="#ffffff22"/>`,flair1:`<circle cx="50" cy="25" r="6" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="35" cy="15" r="3" fill="FLAIR2COLOR"/><circle cx="65" cy="15" r="3" fill="FLAIR2COLOR"/><circle cx="35" cy="35" r="3" fill="FLAIR2COLOR"/><circle cx="65" cy="35" r="3" fill="FLAIR2COLOR"/>`},
  staff:{base:`<rect x="47" y="40" width="6" height="80" fill="#6d5b43" stroke="#3a2a1a" stroke-width="1.5"/><circle cx="50" cy="20" r="22" fill="BASECOLOR" stroke="#333" stroke-width="2"/><circle cx="50" cy="20" r="14" fill="#ffffff22"/><path d="M35 110 L50 105 L65 110 L50 120 Z" fill="#8B4513" stroke="#3a2a1a" stroke-width="1"/>`,flair1:`<circle cx="50" cy="20" r="8" fill="FLAIR1COLOR"/><circle cx="50" cy="10" r="4" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="30" cy="10" r="4" fill="FLAIR2COLOR"/><circle cx="70" cy="10" r="4" fill="FLAIR2COLOR"/><circle cx="30" cy="30" r="4" fill="FLAIR2COLOR"/><circle cx="70" cy="30" r="4" fill="FLAIR2COLOR"/>`},
  scepter:{base:`<rect x="46" y="45" width="8" height="75" fill="#8B6914" stroke="#5a4307" stroke-width="1.5"/><circle cx="50" cy="18" r="25" fill="BASECOLOR" stroke="#333" stroke-width="2.5"/><circle cx="50" cy="18" r="16" fill="#ffffff33"/><path d="M30 15 L50 8 L70 15" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/><path d="M30 21 L50 28 L70 21" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/><rect x="42" y="115" width="16" height="8" fill="#d4af37" stroke="#8B6914" stroke-width="1"/>`,flair1:`<circle cx="50" cy="18" r="10" fill="FLAIR1COLOR"/><circle cx="50" cy="8" r="5" fill="FLAIR1COLOR"/><circle cx="50" cy="28" r="5" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="28" cy="8" r="5" fill="FLAIR2COLOR"/><circle cx="72" cy="8" r="5" fill="FLAIR2COLOR"/><circle cx="25" cy="25" r="4" fill="FLAIR2COLOR"/><circle cx="75" cy="25" r="4" fill="FLAIR2COLOR"/><circle cx="35" cy="18" r="3" fill="FLAIR2COLOR"/><circle cx="65" cy="18" r="3" fill="FLAIR2COLOR"/>`},

  // BLUNT CATEGORY
  mace:{base:`<path d="M45 70 L45 120 L55 120 L55 70 Z" fill="#8B4513" stroke="#333" stroke-width="1"/><circle cx="50" cy="40" r="28" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/><circle cx="50" cy="40" r="18" fill="#ffffff15"/>`,flair1:`<circle cx="50" cy="40" r="8" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="30" cy="25" r="5" fill="FLAIR2COLOR"/><circle cx="70" cy="25" r="5" fill="FLAIR2COLOR"/><circle cx="30" cy="55" r="5" fill="FLAIR2COLOR"/><circle cx="70" cy="55" r="5" fill="FLAIR2COLOR"/>`},
  warhammer:{base:`<path d="M44 75 L44 120 L56 120 L56 75 Z" fill="#8B4513" stroke="#333" stroke-width="1.5"/><rect x="30" y="35" width="40" height="35" fill="BASECOLOR" stroke="#333" stroke-width="2"/><rect x="34" y="40" width="32" height="25" fill="#ffffff15"/><path d="M25 40 L30 35 M25 65 L30 70 M75 40 L70 35 M75 65 L70 70" stroke="#333" stroke-width="2"/>`,flair1:`<circle cx="50" cy="52" r="9" fill="FLAIR1COLOR"/>`,flair2:`<rect x="35" y="45" width="6" height="6" fill="FLAIR2COLOR"/><rect x="59" y="45" width="6" height="6" fill="FLAIR2COLOR"/><rect x="35" y="57" width="6" height="6" fill="FLAIR2COLOR"/><rect x="59" y="57" width="6" height="6" fill="FLAIR2COLOR"/>`},
  maul:{base:`<path d="M43 80 L43 122 L57 122 L57 80 Z" fill="#6d5b43" stroke="#3a2a1a" stroke-width="2"/><rect x="25" y="30" width="50" height="45" fill="BASECOLOR" stroke="#333" stroke-width="2.5"/><rect x="30" y="36" width="40" height="33" fill="#ffffff18"/><path d="M20 35 L25 30 M20 70 L25 75 M80 35 L75 30 M80 70 L75 75" stroke="#333" stroke-width="3"/><rect x="38" y="50" width="24" height="10" fill="#444"/>`,flair1:`<circle cx="50" cy="52" r="10" fill="FLAIR1COLOR"/><circle cx="50" cy="42" r="5" fill="FLAIR1COLOR"/><circle cx="50" cy="62" r="5" fill="FLAIR1COLOR"/>`,flair2:`<rect x="32" y="38" width="8" height="8" fill="FLAIR2COLOR"/><rect x="60" y="38" width="8" height="8" fill="FLAIR2COLOR"/><rect x="32" y="59" width="8" height="8" fill="FLAIR2COLOR"/><rect x="60" y="59" width="8" height="8" fill="FLAIR2COLOR"/><circle cx="50" cy="32" r="4" fill="FLAIR2COLOR"/><circle cx="50" cy="72" r="4" fill="FLAIR2COLOR"/>`},

  // OLD WEAPONS (keeping for backwards compatibility)
  stick:{base:`<path d="M48 15 Q45 60 48 120 L52 120 Q55 60 52 15 Z" fill="#5a4a3a" stroke="#3a2a1a" stroke-width="1"/><path d="M46 30 L44 28 M54 50 L57 48 M47 80 L44 82" stroke="#3a2a1a" stroke-width="1.5"/>`,flair1:``,flair2:``},
  hammer:{base:`<rect x="45" y="80" width="10" height="40" fill="#6d5b43" stroke="#3a2a1a" stroke-width="1"/><rect x="35" y="40" width="30" height="30" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/>`,flair1:`<circle cx="50" cy="55" r="6" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="40" cy="55" r="4" fill="FLAIR2COLOR"/><circle cx="60" cy="55" r="4" fill="FLAIR2COLOR"/>`},
  dagger:{base:`<path d="M50 15 L55 20 L55 65 L58 70 L58 75 L50 75 L42 75 L42 70 L45 65 L45 20 Z" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/><circle cx="50" cy="75" r="4" fill="#8B4513"/>`,flair1:`<circle cx="50" cy="35" r="4" fill="FLAIR1COLOR"/>`,flair2:`<path d="M35 25 L32 23 M65 25 L68 23" stroke="FLAIR2COLOR" stroke-width="2" stroke-linecap="round"/>`},
  axe:{base:`<rect x="47" y="60" width="6" height="60" fill="#6d5b43" stroke="#3a2a1a" stroke-width="1"/><path d="M53 60 L80 50 L80 70 L53 60 Z" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/><path d="M47 60 L20 50 L20 70 L47 60 Z" fill="BASECOLOR" stroke="#333" stroke-width="1.5"/>`,flair1:`<circle cx="50" cy="80" r="6" fill="FLAIR1COLOR"/>`,flair2:`<circle cx="35" cy="55" r="4" fill="FLAIR2COLOR"/><circle cx="65" cy="55" r="4" fill="FLAIR2COLOR"/>`}
};
const BASE_COLORS={
  // Slash
  sword:"#7a8b99",
  greatsword:"#8a9baa",
  claymore:"#9aabbb",
  // Pierce
  bow:"#8B4513",
  longbow:"#9B5523",
  warbow:"#AB6533",
  // Magic
  wand:"#9966cc",
  staff:"#aa77dd",
  scepter:"#bb88ee",
  // Blunt
  mace:"#6a6a7a",
  warhammer:"#7a7a8a",
  maul:"#8a8a9a",
  // Old weapons
  stick:"#5a4a3a",
  hammer:"#86654b",
  dagger:"#7f7f7f",
  axe:"#7a4c30"
};

// Persistent storage keys for saves and lifetime stats
const SAVE_KEY="wordyweapon-save";
const STATS_KEY="wordyweapon-stats";

// Lifetime stats and achievement tracking. These values persist between runs.
let PStats={
  attempts:0,
  victories:0,
  weaponsForged:0,
  bestDamage:0,
  heroClears:{},
  stackedCreations:0
};

// === STATE ===
let S={
  wins:0,losses:0,streak:0,gold:30,
  hero:null,enemy:null,
  currentHP:100, // Hero's current HP
  level:1, // Hero level (increments each battle)
  roundIndex:1, // Current round in the run
  floor:1, // Current floor (3 rounds per floor)
  nextEnemy:null, // Cached preview enemy for next round
  talents:[], // Active talents for this run
  consumables:[], // Owned consumables
  inv:[], // Word inventory
  sel:{item:null,adj1:null,adj2:null,adj3:null,adj4:null,noun1:null}, // Selected words: 1 weapon, 4 adjectives, 1 noun
  // Word currently selected from the bank awaiting assignment to a slot
  pendingWord:null,
  rerollCost:5,
  sortMode:"type",
  // Sort direction for the forge inventory: true=ascending, false=descending
  sortAsc:true,
  shopSortMode:"type", // Sort mode for shop word bank
  shopSortAsc:true, // Sort direction for shop word bank: true=ascending, false=descending
  heroSelected:false, // Whether hero has been selected for this run
  shadowBonusHP:0, // For Shadow Pact talent
  battleHardenedBonus:0, // For Battle Hardened talent cap tracking
  quickStudyBonus:0, // For Quick Study talent cap tracking
  tempEffects:{} // One-battle temporary modifiers
},audioOn=true;

function loadStats(){
  try{
    const raw=localStorage.getItem(STATS_KEY);
    if(raw){
      PStats={...PStats,...JSON.parse(raw)};
    }
  }catch(e){console.warn("Failed to load stats",e);}
}
function saveStats(){
  try{localStorage.setItem(STATS_KEY,JSON.stringify(PStats));}catch(e){console.warn("Failed to save stats",e);}
}
function saveRun(){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){console.warn("Failed to save run",e);}finally{updateContinueButtons();}
}
function loadRun(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(raw){
      const data=JSON.parse(raw);
      S={...S,...data};
      return true;
    }
  }catch(e){console.warn("Failed to load run",e);}return false;
}
function clearRunSave(){
  try{localStorage.removeItem(SAVE_KEY);}catch(e){console.warn("Failed to clear save",e);}finally{updateContinueButtons();}
}

function hasSavedRun(){
  try{return !!localStorage.getItem(SAVE_KEY);}catch(e){return false;}
}

function updateContinueButtons(){
  const contBtn=document.getElementById('continue-btn');
  if(contBtn){
    contBtn.style.display = hasSavedRun()? 'block' : 'none';
  }
}

function showMainMenu(){
  const overlays=['shop-overlay','pause-menu','hero-select-overlay','combat-overlay','talent-overlay','achievements-overlay'];
  overlays.forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('show');
  });
  const mainMenu=document.getElementById('main-menu');
  if(mainMenu){
    mainMenu.classList.add('show');
    mainMenu.focus?.();
  }
}

function renderStats(){
  const box=document.getElementById('stats-container');
  if(!box) return;
  const heroList=Object.keys(PStats.heroClears||{}).filter(k=>PStats.heroClears[k]);
  const stackedAch = PStats.stackedCreations>=10 ? '✅' : `(${PStats.stackedCreations}/10)`;
  box.innerHTML=
    `<div><strong>Total run attempts:</strong> ${PStats.attempts}</div>`+
    `<div><strong>Victories (Round 9):</strong> ${PStats.victories}</div>`+
    `<div><strong>Weapons forged:</strong> ${PStats.weaponsForged}</div>`+
    `<div><strong>Most powerful weapon:</strong> ${PStats.bestDamage} AP</div>`+
    `<div><strong>Heroes cleared:</strong> ${heroList.length?heroList.join(', '):'None'}</div>`+
    `<div><strong>Achievement – Fully stacked x10:</strong> ${stackedAch}</div>`;
}

// === AUDIO ===
let audioCtx=null;
function initAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)()}
function playTone(freq,dur,type='sine',vol=0.15){
  if(!audioOn||!audioCtx)return;
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type;o.frequency.value=freq;
  g.gain.setValueAtTime(vol,audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+dur);
  o.connect(g);g.connect(audioCtx.destination);
  o.start();o.stop(audioCtx.currentTime+dur);
}
function sfxHover(){playTone(800,0.04,'sine',0.06)}
function sfxClick(){playTone(600,0.08,'sine',0.12);setTimeout(()=>playTone(900,0.12,'sine',0.1),40)}
function sfxRemove(){playTone(400,0.1,'sine',0.1)}
function sfxImpact(intensity=1){
  const base=150+intensity*100;
  playTone(base,0.15,'sawtooth',0.2*intensity);
  setTimeout(()=>playTone(base*1.5,0.1,'square',0.15*intensity),30);
  setTimeout(()=>playTone(base*2,0.2,'sine',0.25*intensity),60);
}
function sfxForgeStart(){playTone(100,0.5,'sawtooth',0.1)}
function sfxWin(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.4,'sine',0.25),i*120))}
function sfxLose(){[400,300,200,150].forEach((f,i)=>setTimeout(()=>playTone(f,0.35,'sine',0.15),i*180))}

function sfxBuy(){playTone(880,0.1,'sine',0.15);setTimeout(()=>playTone(1100,0.15,'sine',0.12),80)}

const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

// === INIT ===
function init(){
  // Start with a curated subset of words. Provide all common weapons and a mix of Tier 1
  // and Tier 2 words (excluding hidden words) to give players options without filling
  // the entire inventory. This mirrors the starting inventory logic in startNewRun().
  const weaponPool = WORDS.filter(w => w.type === 'weapon' && w.rarity === R.COMMON);
  const nonWeaponPool = WORDS.filter(w => w.type !== 'weapon' && !w.hiddenInBank &&
    (RRANK[w.rarity] === 0 || RRANK[w.rarity] === 2));
  const shuffledNon = shuf([...nonWeaponPool]);
  const desiredStart = Math.min(nonWeaponPool.length, Math.floor(INV_LIMIT / 2) - weaponPool.length);
  const startNon = shuffledNon.slice(0, Math.max(0, desiredStart)).map(w => ({ ...w }));
  S.inv = [...weaponPool.map(w => ({ ...w })), ...startNon];

  setupEvents();
  const forgeBtn = document.getElementById("forge-btn");
  if(forgeBtn){
    forgeBtn.onclick = forge;
    forgeBtn.onmouseenter = sfxHover;
  }
  const combatContinueBtn = document.getElementById("combat-continue");
  if(combatContinueBtn){
    combatContinueBtn.onclick = afterCombat;
    combatContinueBtn.onmouseenter = sfxHover;
  }
  const shopContinueBtn = document.getElementById("shop-continue");
  if(shopContinueBtn){
    shopContinueBtn.onclick = () => {
      document.getElementById("shop-overlay").classList.remove("show");
      S.rerollCost = 5;
      clrSel();
      newEnc();
      render();
    };
    shopContinueBtn.onmouseenter = sfxHover;
  }
  const shopMenuBtn = document.getElementById("shop-menu");
  if(shopMenuBtn){
    shopMenuBtn.onclick = () => {
      document.getElementById("shop-overlay").classList.remove("show");
      document.getElementById('pause-menu').classList.add('show');
    };
    shopMenuBtn.onmouseenter = sfxHover;
  }
  const rerollBtn = document.getElementById("reroll-btn");
  if(rerollBtn){
    rerollBtn.onclick = rerollShop;
    rerollBtn.onmouseenter = sfxHover;
  }
  // Attach multiplier breakdown tooltip to the damage preview panel on first init.
  const previewPanel = document.getElementById('damage-preview-text');
  if(previewPanel && !previewPanel.__tooltipAttached){
    previewPanel.__tooltipAttached = true;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.whiteSpace = 'normal';
    tooltip.style.pointerEvents = 'none';
    previewPanel.appendChild(tooltip);
    previewPanel.addEventListener('mouseenter', () => {
      const content = buildMultiplierTooltip();
      tooltip.innerHTML = content;
      tooltip.style.opacity = content ? '1' : '0';
    });
    previewPanel.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  }
  const sellWordBtn = document.getElementById("sell-word-btn");
  if (sellWordBtn) {
    sellWordBtn.onmouseenter = sfxHover;
    sellWordBtn.onclick = () => {
      if (selectedSellWords && selectedSellWords.length > 0) {
        // Sort indices descending so splicing doesn't invalidate indices
        const sortedIdx = selectedSellWords.map(({ idx }) => idx).sort((a, b) => b - a);
        let total = 0;
        selectedSellWords.forEach(({ word }) => {
          const tier = RRANK[word.rarity] || 0;
          const sellPrice = tier === 0 ? 2 : tier === 2 ? 5 : 10;
          total += sellPrice;
        });
        S.gold += total;
        sortedIdx.forEach(i => {
          if (i >= 0) S.inv.splice(i, 1);
        });
        sfxBuy();
        // Clear selection
        selectedSellWords = [];
        document.getElementById("sell-price-display").textContent = "";
        document.getElementById("sell-word-btn").disabled = true;
        // Remove selected class from any highlighted chips
        document.querySelectorAll("#shop-word-bank .chip.selected").forEach(c => c.classList.remove("selected"));
        renderShop();
        render();
      }
    };
  }

  // Deselect button clears all selected words in the shop inventory
  const deselectBtn = document.getElementById('deselect-btn');
  if(deselectBtn){
    deselectBtn.onclick = () => {
      selectedSellWords = [];
      document.getElementById('sell-price-display').textContent = "";
      document.getElementById('sell-word-btn').disabled = true;
      // Remove highlight from all chips
      const bank = document.getElementById('shop-word-bank');
      if(bank){
        bank.querySelectorAll('.chip.selected').forEach(c => c.classList.remove('selected'));
      }
    };
    // Hover sound for deselect button
    deselectBtn.onmouseenter = sfxHover;
  }
  // Inventory UI removed; no events needed
  $("#audio-toggle").onclick=()=>{audioOn=!audioOn;$("#audio-toggle").textContent=`🔊 Sound: ${audioOn?'ON':'OFF'}`};
  document.addEventListener("click",()=>initAudio(),{once:true});

  // Sort buttons for forge
  $$("#sort-btns button").forEach(btn=>{
    btn.onclick=()=>{
      S.sortMode=btn.dataset.sort;
      $$("#sort-btns button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      renderBank();
    };
  });

  // Sort direction toggle for forge inventory
  const sortDirForgeBtn = document.getElementById('sort-dir-btn-forge');
  if(sortDirForgeBtn){
    sortDirForgeBtn.onclick = () => {
      S.sortAsc = !S.sortAsc;
      // Update arrow text (down = ascending, up = descending)
      sortDirForgeBtn.textContent = S.sortAsc ? '↓' : '↑';
      renderBank();
    };
    sortDirForgeBtn.onmouseenter = sfxHover;
  }

  // Sort buttons for shop word bank
  $$("#shop-sort-btns button").forEach(btn=>{
    btn.onclick = () => {
      S.shopSortMode = btn.dataset.sort;
      $$("#shop-sort-btns button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderShopWordBank();
    };
    // Play hover sound on shop sort buttons
    btn.onmouseenter = sfxHover;
  });
  // Sort direction toggle for shop
  const sortDirBtn = document.getElementById('sort-dir-btn');
  if(sortDirBtn){
    sortDirBtn.onclick = () => {
      S.shopSortAsc = !S.shopSortAsc;
      // Update arrow icon to indicate direction (down = ascending, up = descending)
      sortDirBtn.textContent = S.shopSortAsc ? '↓' : '↑';
      renderShopWordBank();
    };
    sortDirBtn.onmouseenter = sfxHover;
  }

  // Attach details panels to the portrait containers.  Hovering over a portrait
  // shows its details panel; moving the pointer away hides it.  The panels
  // remain visible when hovered over directly.
  {
    const heroPortrait = document.querySelector('.hero-portrait');
    const heroPanel = document.getElementById('hero-details-panel');
    if(heroPortrait && heroPanel){
      heroPortrait.onmouseenter = () => {
        heroPanel.classList.remove('hidden');
        sfxHover();
      };
      heroPortrait.onmouseleave = () => heroPanel.classList.add('hidden');
      heroPanel.onmouseenter = () => heroPanel.classList.remove('hidden');
      heroPanel.onmouseleave = () => heroPanel.classList.add('hidden');
    }
    const enemyPortrait = document.querySelector('.enemy-portrait');
    const enemyPanel = document.getElementById('enemy-details-panel');
    if(enemyPortrait && enemyPanel){
      enemyPortrait.onmouseenter = () => {
        enemyPanel.classList.remove('hidden');
        sfxHover();
      };
      enemyPortrait.onmouseleave = () => enemyPanel.classList.add('hidden');
      enemyPanel.onmouseenter = () => enemyPanel.classList.remove('hidden');
      enemyPanel.onmouseleave = () => enemyPanel.classList.add('hidden');
    }
  }

  // Bind main menu start button.  When clicked, hide the menu and begin a new run.
  // Note: The start button handler is now bound on DOMContentLoaded for reliability. See below.

}

function startNewRun(){
  // Reset run state
  S.wins=0;S.losses=0;S.streak=0;S.gold=30;
  S.level=1;S.roundIndex=1;S.floor=1;
  S.talents=[]; // Reset talents
  S.shadowBonusHP=0; // Reset talent state
  S.battleHardenedBonus=0; // Reset talent state
  S.quickStudyBonus=0; // Reset talent state
  S.tempEffects={};
  S.consumables=[];
  // Reset hero selection flag so that a new hero must be chosen on each new run.
  S.heroSelected = false;
  // Populate starting inventory: give all Tier 1 weapons (COMMON rarity) to the player
  // up front, then fill the rest of the starting inventory with a mix of Tier 1 and Tier 2
  // words (affinities, adjectives, nouns). Hidden words are excluded. This provides
  // players with a broad vocabulary from the outset.
  const weaponPool = WORDS.filter(w => w.type === 'weapon' && w.rarity === R.COMMON);
  const nonWeaponPool = WORDS.filter(w => w.type !== 'weapon' && !w.hiddenInBank &&
    (RRANK[w.rarity] === 0 || RRANK[w.rarity] === 2));
  const shuffledNon = shuf([...nonWeaponPool]);
  // Determine how many non-weapon words to include at start. Fill up to half the
  // inventory limit minus the number of weapons to give players room to loot more.
  const desiredStart = Math.min(nonWeaponPool.length, Math.floor(INV_LIMIT / 2) - weaponPool.length);
  const startNon = shuffledNon.slice(0, Math.max(0, desiredStart)).map(w => ({ ...w }));
  S.inv = [...weaponPool.map(w => ({ ...w })), ...startNon];
  PStats.attempts++;saveStats();clearRunSave();
  clrSel();
  showHeroSelect();
}

let currentHeroIndex = 0;

function showHeroSelect(){
  currentHeroIndex = 0;
  const container = $("#hero-card-container");
  container.innerHTML = "";

  HEROES.forEach((h, idx) => {
    const card = document.createElement("div");
    card.className = "card hero";
    card.style.minWidth = "100%";
    card.style.flex = "0 0 100%";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div class="card-name">${h.name}</div>
      <div class="card-desc">${h.desc}</div>
      <div class="card-stats" style="margin:8px 0">HP: ${h.hp}</div>
      <div class="card-section" style="margin-bottom:4px"><div class="card-section-title">Strong using</div><div>${h.str.map(el=>`<span class="tag str">${EN[el]}</span>`).join("")}</div></div>
      <div class="card-section" style="margin-bottom:4px"><div class="card-section-title">Weak using</div><div>${h.weak.map(el=>`<span class="tag weak">${EN[el]}</span>`).join("")}</div></div>
      <div class="card-section"><div class="card-section-title">PROFICIENCIES</div><div><span class="tag prof">${h.good} ×2.0</span><span class="tag weak">${h.bad} ×0.5</span></div></div>
    `;
    container.appendChild(card);
  });

  updateCarousel();

  $("#hero-prev").onclick = () => {
    currentHeroIndex = (currentHeroIndex - 1 + HEROES.length) % HEROES.length;
    updateCarousel();
  };

  $("#hero-next").onclick = () => {
    currentHeroIndex = (currentHeroIndex + 1) % HEROES.length;
    updateCarousel();
  };

  $("#hero-select-btn").onclick = () => {
    const h = HEROES[currentHeroIndex];
    S.hero = {...h};
    S.currentHP = h.hp;
    S.heroSelected = true;
    $("#hero-select-overlay").classList.remove("show");
    newEnc();
  };

  $("#hero-select-overlay").classList.add("show");
}

function updateCarousel(){
  const container = $("#hero-card-container");
  container.style.transform = `translateX(-${currentHeroIndex * 100}%)`;
}

function newEnc(){
  if(!S.heroSelected){showHeroSelect();return}

  // Scale enemy based on roundIndex - Balatro-style exponential scaling.
  // Use the cached preview enemy so the shop preview matches the upcoming fight.
  if(!S.nextEnemy){
    S.nextEnemy = (ENEMIES[Math.random()*ENEMIES.length|0]||{}).id;
  }
  const baseEnemy = ENEMIES.find(en=>en.id===S.nextEnemy) || ENEMIES[0];
  S.enemy={...baseEnemy};

  // Start at 4 HP for round 1, scale to ~115 for round 9 (becomes 150 after 1.3x boss multiplier)
  // Gradual exponential scaling with boss spikes built in
  // Start enemy HP at 5 instead of 4 and scale at roughly the same rate
  // Adjust enemy HP scaling.  Round 1 starts at 5 HP and the final boss (round 9)
  // has 300 HP.  Boss rounds (3, 6, 9) receive larger jumps for a slight
  // difficulty spike.
  const hpScaling=[5,15,30,55,85,130,180,240,300];
  const roundIdx=Math.min(S.roundIndex-1,hpScaling.length-1);
  S.enemy.hp=hpScaling[roundIdx];

  // AP scales more gently - start at 15 and increase by 5 each round
  S.enemy.ap=15+(S.roundIndex-1)*5;

  // Boss on round 3, 6, 9, etc - moderate boost
  const isBoss=S.roundIndex%3===0;
  if(isBoss){
    S.enemy.hp=Math.round(S.enemy.hp*1.3);
    S.enemy.ap=Math.round(S.enemy.ap*1.2);
    S.enemy.name="[BOSS] "+S.enemy.name;
  }

  // Consume cached preview so the next shop call will roll a fresh foe
  S.nextEnemy=null;

  // [T2] Shadow Pact: Apply HP steal from previous dark word use
  if(S.shadowBonusHP > 0){
    S.enemy.hp = Math.max(1, S.enemy.hp - S.shadowBonusHP);
    S.shadowBonusHP = 0; // Reset after applying
  }

  saveRun();
  render();
}

// === RENDER ===
function render(){
  const h=S.hero,e=S.enemy;
  const effectiveRes=(S.tempEffects && S.tempEffects.polymorph)?[]:e.res;

  // Portrait names
  $("#hero-name").textContent=h.name;
  $("#enemy-name").textContent=e.name;

  // Populate hero and enemy element tags on portraits
  // Calculate total damage with multiplier for display
  const c=calc();
  const totalDmg = c.heroDmg || 0;
  // Do not display hero AP on the portrait; AP is shown in the damage preview instead
  const heroApTag = "";
  const heroStrTags=h.str.map(el=>`<span class="tag str">${EN[el]}</span>`).join("");
  const heroWeakTags=h.weak.map(el=>`<span class="tag weak">${EN[el]}</span>`).join("");
  // Determine proficiency display: if Weapon Master is active, treat all weapons as good
  const hasWM=!!(S.tempEffects && S.tempEffects.weaponMaster);
  let heroProfHtml="";
  if(hasWM){
    heroProfHtml=`<span class="tag prof">All weapons ×2.0 (affected by Weapon Master)</span>`;
  }else{
    heroProfHtml=`<span class="tag prof">${h.good} ×2.0</span><span class="tag weak">${h.bad} ×0.5</span>`;
  }
  $("#hero-elements").innerHTML=heroApTag+heroStrTags+heroWeakTags+heroProfHtml;

  // Enemy portrait: show only weaknesses and resistances (AP removed)
  const enemyWeakTags=e.weak.map(el=>`<span class="tag str">${EN[el]}</span>`).join("");
  const resList = (S.tempEffects && S.tempEffects.polymorph) ? [] : e.res;
  const enemyResTags=resList.length?resList.map(el=>`<span class="tag weak">${EN[el]}</span>`).join(""):"";
  $("#enemy-elements").innerHTML=enemyWeakTags+enemyResTags;

  // Health bars with dynamic preview
  updateHealthBars();

  // Details panels (hidden by default)
  // Update HP in details panel (Base AP removed)
  const heroApDiv = document.getElementById("hero-ap");
  if(heroApDiv){
    heroApDiv.textContent = `HP: ${h.hp}`;
  }
  $("#hero-desc").textContent=h.desc;
  $("#hero-dialogue").textContent=`"${h.dialogue[Math.random()*h.dialogue.length|0]}"`;
  // Also update the inline portrait dialogue (no quotes) for the hero
  {
    const inline = document.getElementById('hero-inline-dialogue');
    if(inline){
      const line = h.dialogue[Math.random()*h.dialogue.length|0];
      inline.textContent = line;
    }
  }
  $("#hero-str").innerHTML=h.str.map(el=>`<span class="tag str">${EN[el]}</span>`).join("");
  $("#hero-weak").innerHTML=h.weak.map(el=>`<span class="tag weak">${EN[el]}</span>`).join("");
  // Update proficiency display in details panel: reflect Weapon Master if active
  if(hasWM){
    $("#hero-prof").innerHTML=`<span class="tag prof">All weapons ×2.0 (affected by Weapon Master)</span>`;
  }else{
    $("#hero-prof").innerHTML=`<span class="tag prof">${h.good} ×2.0</span><span class="tag weak">${h.bad} ×0.5</span>`;
  }

  $("#enemy-desc").textContent=e.desc;
  $("#enemy-dialogue").textContent=`"${e.dialogue[Math.random()*e.dialogue.length|0]}"`;
  // And update the inline dialogue beneath the enemy portrait
  {
    const inlineE = document.getElementById('enemy-inline-dialogue');
    if(inlineE){
      const line2 = e.dialogue[Math.random()*e.dialogue.length|0];
      inlineE.textContent = line2;
    }
  }
  $("#enemy-weak").innerHTML=e.weak.map(el=>`<span class="tag str">${EN[el]}</span>`).join("");
  const enemyDetailRes = (S.tempEffects && S.tempEffects.polymorph) ? [] : e.res;
  $("#enemy-res").innerHTML=enemyDetailRes.length?enemyDetailRes.map(el=>`<span class="tag weak">${EN[el]}</span>`).join(""):"";

  // Header stats (wins and losses removed)
  if(document.getElementById('streak')) document.getElementById('streak').textContent = S.streak;
  if(document.getElementById('gold')) document.getElementById('gold').textContent = S.gold;
  if(document.getElementById('level')) document.getElementById('level').textContent = S.level;
  if(document.getElementById('round-num')) document.getElementById('round-num').textContent = S.roundIndex;

  // Do not list active buffs (talents) on the hero portrait.  Buffs now live
  // exclusively in the talent bar and shop overlay.  Clear any existing
  // children from the hero talents container so nothing is displayed here.
  const talentsEl = document.getElementById("hero-talents");
  if(talentsEl){
    talentsEl.innerHTML = '';
    // Optionally, we could show a brief summary like "Buffs: n/5", but
    // leaving this blank keeps the portrait UI uncluttered.
  }

  // Update inventory counter (current count / limit)
  const invEl=document.getElementById("inv-counter");
  if(invEl){invEl.textContent=`${S.inv.length}/${INV_LIMIT}`;}

  updSlots();renderBank();renderConsumables();renderTalents();renderWeapon();updateSlotCalcs();
}

function updateHealthBars(){
  const h=S.hero,e=S.enemy;

  // Hide hero health bar and text. Hero HP is no longer tracked.
  const heroBar = document.getElementById('hero-health-fill');
  const heroText = document.getElementById('hero-health-text');
  if(heroBar) heroBar.style.width = '0%';
  if(heroText) heroText.textContent = '';

  // Enemy health always starts full for preview
  $("#enemy-health-fill").style.width="100%";
  $("#enemy-health-text").textContent=`${e.hp} / ${e.hp}`;

  // Calculate and show damage preview
  if(S.sel.item){
    const c=calc();
    const heroDmg=Math.round(c.heroDmg);
    const enemyDmg=Math.round(c.enemyDmg);
    const fmtVal = (v)=>Number.isInteger(v)?v:parseFloat(v.toFixed(2));
    const calcLine = `${fmtVal(c.baseAP)} AP × ${fmtVal(c.wordCount)}`;

    // Show final damage as the main number with the calculation as muted subtext
    $("#preview-hero-dmg").textContent = `${heroDmg}`;
    $("#preview-base-ap").textContent = `${c.baseAP} [AP] x ${c.wordCount}`;

    // Highlight preview panel when damage meets or exceeds enemy HP
    const previewPanel = document.getElementById("damage-preview-text");
    if(previewPanel){
      previewPanel.classList.toggle("goal-achieved", heroDmg >= e.hp);
    }

    // Update enemy HP text to show remaining HP after preview damage
    const remainingHP = Math.max(e.hp - heroDmg, 0);
    document.getElementById('enemy-health-text').textContent = `${remainingHP} / ${e.hp}`;
    // Show enemy damage preview (red bar showing how much HP will be lost)
    const enemyDmgPercent = (heroDmg / e.hp) * 100;
    const edp = document.getElementById('enemy-damage-preview');
    edp.style.width = `${enemyDmgPercent}%`;
    edp.style.display = "block";
    // Trigger blink animation on the damage preview bar
    edp.classList.remove('blink');
    void edp.offsetWidth; // restart animation
    edp.classList.add('blink');

    // Hide hero damage preview since enemy no longer deals damage
    $("#hero-damage-preview").style.display="none";

    // Color code the damage number based on outcome
    if(heroDmg >= e.hp){
      $("#preview-hero-dmg").style.color = "#4ade80";
      $("#preview-hero-dmg").style.fontWeight = "bold";
    } else {
      $("#preview-hero-dmg").style.color = "#fb923c";
      $("#preview-hero-dmg").style.fontWeight = "";
    }
  }else{
    // Show 0 damage when no weapon selected
    $("#preview-hero-dmg").textContent="0";
    $("#enemy-damage-preview").style.display="none";
    $("#hero-damage-preview").style.display="none";

    // Clear calculation and remove highlight when no weapon
    $("#preview-base-ap").textContent = "0 [AP] x 0";
    const previewPanel = document.getElementById("damage-preview-text");
    if(previewPanel){
      previewPanel.classList.remove("goal-achieved");
    }
  }
}

function updateEnemyCalc(){
  const h=S.hero,e=S.enemy;
  const defMult=h.str.includes(e.atk)?0.7:h.weak.includes(e.atk)?1.5:1;
  const finalDmg=Math.round(e.ap*defMult);
  const calc=$("#enemy-calc");
  if(defMult<1){calc.className="enemy-atk-calc reduced";calc.textContent=`${e.ap}×0.7 = ${finalDmg} ✓`}
  else if(defMult>1){calc.className="enemy-atk-calc amplified";calc.textContent=`${e.ap}×1.5 = ${finalDmg} ⚠`}
  else{calc.className="enemy-atk-calc neutral";calc.textContent=`= ${finalDmg} dmg`}
}

function hasWeapons(){return S.inv.some(w=>w.type==="weapon")}

function updSlots(){
  const hasItem = !!S.sel.item;
  const hasNoun = !!S.sel.noun1;

  // Dynamic slot visibility: only weapon slot shown by default. When a weapon is selected,
  // reveal the gem slot. Once the gem slot is filled, reveal adjective slots. The "of" label
  // appears only when both a weapon and a gem are present.
  // Determine visibility of slots. Show the gem slot as soon as a weapon is selected.
  // Show the first two adjective slots (adj1, adj2) when a weapon is present. Show the
  // remaining adjective slots (adj3, adj4) only after a gem has been selected. Always
  // display the "of (the)" label once a weapon is chosen so players understand the
  // construction of the phrase even before a gem is applied.
  const showAdj12 = hasItem;
  const showAdj34 = hasItem && hasNoun;
  // Toggle visibility for the first two adjective slots
  ['adj1','adj2'].forEach(k => {
    const cont = document.querySelector(`[data-slot="${k}"].slot-container`);
    if(cont) cont.classList.toggle('hidden', !showAdj12);
  });
  // Toggle visibility for the last two adjective slots
  ['adj3','adj4'].forEach(k => {
    const cont = document.querySelector(`[data-slot="${k}"].slot-container`);
    if(cont) cont.classList.toggle('hidden', !showAdj34);
  });
  // Show the gem slot only if a weapon is selected
  const nounCont = document.querySelector('[data-slot="noun1"].slot-container');
  if(nounCont) nounCont.classList.toggle('hidden', !hasItem);
  // Show "of (the)" label whenever a weapon is selected
  $('#of-label').classList.toggle('hidden', !hasItem);

  ["item","adj1","adj2","adj3","adj4","noun1"].forEach(k=>{
    const slot=$(`[data-slot="${k}"].slot`);
    if(!slot) return;
    const w=S.sel[k];
    if(w){
      // Determine rarity class (stick uses rusty)
      const rc = w.isStick ? "rarity-rusty" : RC[w.rarity];
      // Convert nouns placed in adjective slots to their adjective form, and adjectives placed
      // in gem slots to their noun form when available. Otherwise use the word's own name.
      let displayName = w.name;
      const forms = WORD_FORMS[w.id];
      if(k.startsWith('adj')){
        displayName = (forms && forms.prefix) || w.name;
      } else if(k.startsWith('noun')){
        displayName = (forms && forms.suffix) || w.name;
      }
      // Insert the display name and append a tooltip for this word.  The slot itself
      // becomes the anchor for the tooltip.  Remove any existing tooltip to avoid
      // duplicates when re-rendering.
      slot.innerHTML = `<span class="${rc}">${displayName}</span>`;
      slot.classList.add("filled");
      // Remove any pre-existing tooltip within the slot
      const oldTip = slot.querySelector('.tooltip');
      if(oldTip) oldTip.remove();
      // Generate a new tooltip using mkTooltip and append it
      const ttHtml = mkTooltip(w);
      // Insert the tooltip HTML into the slot
      slot.insertAdjacentHTML('beforeend', ttHtml);
    } else {
      // Provide descriptive placeholders for empty slots so players know what to place
      const labels={
        item:"Weapon",
        adj1:"Adjective",
        adj2:"Adjective",
        adj3:"Adjective",
        adj4:"Adjective",
        noun1:"Gem (2x AP)"
      };
      slot.innerHTML = labels[k] || "";
      slot.classList.remove("filled");
    }
  });
}

function updateSlotCalcs(){
  const h=S.hero,e=S.enemy,s=S.sel;
  const weakTo=(el)=>e.weak.includes(el);
  const resists=(el)=>!(S.tempEffects && S.tempEffects.polymorph) && e.res.includes(el);
  const effectiveRes=(S.tempEffects && S.tempEffects.polymorph)?[]:e.res;

  // Helper function to show tier value contribution. A slotKey is provided so that
  // nouns placed into the gem slot (noun1) can grant an extra point of AP to emphasize
  // the elemental suffix. Adjectives or affinities placed in the gem slot also
  // benefit from this bonus when they morph into a noun. For adjectives used in
  // adjective slots, no bonus is applied.
  function showWordContribution(word, slotKey) {
    if(!word) return {apText:"",multText:"",className:""};
    if(word.isStick){
      return {apText:"0 AP (0.25x)",multText:"",className:"negative"};
    }

    const baseValue = getBaseAP(word);
    let apMult = 1;
    let className = "";

    // Weapon proficiency for weapons.  Good doubles, poor halves.
    let proficiencyMultiplier = 1;
    if(S.tempEffects && S.tempEffects.weaponMaster){
      proficiencyMultiplier = 2.0;
    } else if(slotKey === 'item' && word.category){
      if(h.good === word.category){
        proficiencyMultiplier = 2.0;
      } else if(h.bad === word.category){
        proficiencyMultiplier = 0.5;
      }
    }
    apMult *= proficiencyMultiplier;

    // Elemental interaction
    if(word.elem !== undefined){
      if(weakTo(word.elem)){
        apMult *= 2;
        className = "positive";
      } else if(resists(word.elem)){
        apMult *= 0;
        className = "negative";
      }
    }

    // Gem slot bonus doubles the AP contribution
    if(slotKey === 'noun1'){
      apMult *= 2;
    }

    // Multiplier adjectives scale the total damage but should be displayed separately
    const multText = (word.mult !== undefined && word.type === 'adjective' && slotKey !== 'noun1')
      ? `×${word.mult}`
      : "";

    // Backup stick penalty (handled above for stick check)

    const apValue = Math.floor(baseValue * apMult);
    const apMultText = apMult !== 1 ? ` (${parseFloat(apMult.toFixed(2)).toString()}x)` : "";
    const apText = `${apValue} AP${apMultText}`;

    // If AP was reduced to zero, force negative styling
    if(apValue === 0) className = "negative";

    return {apText,multText,className};
  }

  // WEAPON (shows tier contribution)
  let itemCalc = {apText:"",multText:"",className:""};
  if(s.item){
    itemCalc = showWordContribution(s.item, 'item');
  }
  $("#calc-item").textContent = itemCalc.apText || "";
  $("#calc-item").className = "slot-calc" + (itemCalc.className ? ` ${itemCalc.className}` : "");
  const itemMultEl = document.getElementById('mult-item');
  if(itemMultEl) itemMultEl.textContent = itemCalc.multText || "";

  // ADJECTIVES (all 4 slots)
  ["adj1","adj2","adj3","adj4"].forEach(k=>{
    const el = $("#calc-" + k);
    const multEl = document.getElementById('mult-' + k);
    if(!el) return;
    const word = s[k];
    const calc = showWordContribution(word, k);
    el.textContent = calc.apText;
    el.className = "slot-calc" + (calc.className ? ` ${calc.className}` : "");
    if(multEl) multEl.textContent = calc.multText;
  });

  // NOUN (single gem slot)
  ["noun1"].forEach(k=>{
    const el = $("#calc-" + k);
    const multEl = document.getElementById('mult-' + k);
    if(!el) return;
    const word = s[k];
    const calc = showWordContribution(word, k);
    el.textContent = calc.apText;
    el.className = "slot-calc" + (calc.className ? ` ${calc.className}` : "");
    if(multEl) multEl.textContent = calc.multText;
  });

  // Update forge button state
  const forgeButton = document.getElementById("forge-btn");
  if (forgeButton) forgeButton.disabled = !S.sel.item;
  saveRun();
}

function sortInventory(inv, sortMode){
  const list=[...inv];
  const mode = sortMode || S.sortMode;
  if(mode==="type"){
    list.sort((a,b)=>(TYPE_ORDER[a.type]||99)-(TYPE_ORDER[b.type]||99)||a.name.localeCompare(b.name));
  }else if(mode==="alpha"){
    list.sort((a,b)=>a.name.localeCompare(b.name));
  }else if(mode==="rarity"){
    list.sort((a,b)=>b.rarity-a.rarity||a.name.localeCompare(b.name));
  }
  return list;
}

function getVisibleBankWords(inv){
  const used = Object.values(S.sel).filter(Boolean);
  return inv.filter(w => !used.includes(w) && !w.hiddenInBank);
}

function getSortedVisibleBankWords(inv, sortMode, sortAsc=true){
  let sorted = sortInventory(getVisibleBankWords(inv), sortMode);
  if(!sortAsc){
    sorted = sorted.slice().reverse();
  }
  return sorted;
}

function renderBank(){
  const bank=$("#bank");
  const hasItem=!!S.sel.item,hasNoun=!!S.sel.noun1;
  const noWeapons=!hasWeapons();
  
  $("#backup-weapon").style.display=noWeapons?"block":"none";
  bank.innerHTML="";
  
  if(noWeapons&&!S.sel.item){
    const c=mkChip(STICK,false,true);
    bank.appendChild(c);
  }
  
  let sorted = getSortedVisibleBankWords(S.inv, S.sortMode, S.sortAsc);
  sorted.forEach(w=>{
    const disabled=isWordDisabled(w,hasItem,hasNoun);
    const c=mkChip(w,disabled,false);
    bank.appendChild(c);
  });
}

// Render owned consumables during forging
function renderConsumables(){
  const cont=document.getElementById("consumables-bar");
  if(!cont) return;
  cont.innerHTML="";
  const count=document.createElement("div");
  count.className="consumable-capacity dim";
  count.textContent=`${S.consumables.length}/${CONSUMABLE_LIMIT} consumables`;
  cont.appendChild(count);
  const owned=S.consumables||[];
  const totalSlots=Math.max(CONSUMABLE_LIMIT, owned.length);
  for(let i=0;i<totalSlots;i++){
    const cid=owned[i];
    const cItem=cid?CONSUMABLES.find(x=>x.id===cid):null;
    const div=document.createElement("div");
    div.className="consumable-item";
    if(cItem){
      div.textContent=cItem.name;
      div.title=cItem.desc;
      div.onclick=()=>{
        // Use consumable effect
        const msg=cItem.use(S);
        alert(msg||`${cItem.name} used`);
        // Remove consumable from list
        S.consumables.splice(i,1);
        render();
      };
    } else {
      div.classList.add("empty");
      div.textContent="Empty";
      div.title="Consumable slot";
    }
    if(i>=CONSUMABLE_LIMIT){
      div.classList.add("capacity-locked");
    }
    cont.appendChild(div);
  }
}

// Render active talents in the talent bar.  Each talent appears as a chip with a
// tooltip describing its effect.  Talents are non-interactive.
function renderTalents(){
  const bar = document.getElementById('talent-bar');
  if(!bar) return;
  bar.innerHTML = '';
  if(!S.talents || S.talents.length === 0){
    return;
  }
  S.talents.forEach(tid => {
    // Look up the talent object by ID.  S.talents only stores IDs, so we must
    // retrieve the full data.  Fallback to an empty object if not found.
    const t = TALENTS.find(x => x.id === tid) || {};
    const chip = document.createElement('div');
    chip.className = 'chip';
    // Determine rarity class based on the talent's rarity; default to common.
    const rc = t.rarity !== undefined ? (RC[t.rarity] || RC[0]) : RC[0];
    // Build tooltip using the talent definition if available.  mkTooltip
    // gracefully handles words and talents alike.
    const tooltip = t.id ? mkTooltip(t) : '';
    chip.innerHTML = `<div class="chip-name ${rc}">${t.name || tid}</div>`+
      `<div class="chip-info">Buff</div>`+
      `${tooltip}`;
    // Buffs are not clickable; disable pointer events
    chip.classList.add('disabled');
    bar.appendChild(chip);
  });
}

function mkChip(w,disabled,isStickChip){
  const c=document.createElement("div");
  c.className="chip"+(disabled?" disabled":"")+(isStickChip?" rusty":"");
  // Assign dataset index only for words in the main inventory; talents and stick chips are excluded
  if(!isStickChip && w.type !== 'talent') c.dataset.idx=S.inv.indexOf(w);
  
  const rc=w.isStick?"rarity-rusty":RC[w.rarity];
  // Determine the label that appears underneath each chip.  For weapons, append
  // their category (e.g. Slash, Blunt, Magic) to clarify how the hero interacts
  // with them.  For all other words, omit the type label entirely and only
  // show the tier (T1, T2, T3).  The backup stick retains its "Backup" tag.
  const rn=w.isStick?"Backup":RN[w.rarity] || "T1";
  let chipInfo = rn;
  if(w.type === 'weapon'){
    // Capitalise the category for display
    const cat = w.category || '';
    chipInfo += ` · ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
  } else if(w.type === 'talent'){
    chipInfo = 'Talent';
  }
  
  // Element display
  let elemHtml="";
  if(w.elem!==undefined){
    elemHtml=`<div class="chip-elem" style="color:${EC[w.elem]}">${EN[w.elem]}</div>`;
  }
  
  // Tooltip
  const tooltip=mkTooltip(w);
  
  // Use the suffix form for the chip name (base noun) for all non‑weapon words to present the most basic form
  // in the inventory.  Weapons retain their own name.
  const formsForChip = WORD_FORMS[w.id];
  let displayName = w.name;
  if(w.type !== 'weapon' && !w.isStick && formsForChip){
    // Display the suffix form (e.g. "Shadow" instead of "Shadowy" or "Shadowed")
    displayName = formsForChip.suffix || w.name;
  }
  c.innerHTML=`
    <div class="chip-name ${rc}">${displayName}</div>
    <div class="chip-info">${chipInfo}</div>
    ${elemHtml}
    ${tooltip}
  `;
  
  if(!disabled){
    c.onclick = () => {
      // If this chip represents the backup stick, immediately equip it and clear selection
      if(isStickChip){
        sfxClick();
        clrSel();
        S.sel.item = STICK;
        S.pendingWord = null;
        render();
        return;
      }
      // Toggle selection on left click
      sfxClick();
      if(S.pendingWord === w){
        // Deselect if already selected
        S.pendingWord = null;
      } else {
        // Select this word
        S.pendingWord = w;
      }
      // Re-render to update highlight and other UI
      render();
    };

    // Right-click to sell word for half price
    if(!isStickChip){
      c.oncontextmenu = (e) => {
        e.preventDefault();
        const sellPrice = Math.floor(wPrice(w) / 2);
        if(confirm(`Sell ${w.name} for ${sellPrice} gold?`)){
          const idx = S.inv.indexOf(w);
          if(idx >= 0){
            S.inv.splice(idx, 1);
            S.gold += sellPrice;
            sfxBuy();
            render();
          }
        }
      };
    }
    c.onmouseenter = sfxHover;
  }

  // Highlight this chip if it is currently selected
  if(S.pendingWord === w){
    c.classList.add('selected');
  }
  return c;
}

function mkTooltip(w){
  // Special handling for talents: display only their description and tier.  Talents do
  // not have elemental interactions, multipliers or morphological forms.  The rarity
  // colour is still used for the title bar.
  if(w.type === 'talent'){
    const rc = RC[w.rarity] || 'rarity-common';
    let lines = [];
    if(w.desc) lines.push(`<div class="tooltip-line">${w.desc}</div>`);
    return `<div class="tooltip">
      <div class="tooltip-title ${rc}">${w.name}</div>
      ${lines.join('')}
    </div>`;
  }
  const rc=w.isStick?"rarity-rusty":RC[w.rarity];
  const rarityRank = RRANK[w.rarity] ?? w.rarity ?? 0;
  const tierLabel = w.isStick?"Backup":(RN[rarityRank] || RN[w.rarity] || "T1");
  
  let lines=[];
  if(w.desc)lines.push(`<div class="tooltip-line">${w.desc}</div>`);
  
  if(w.type==="weapon"&&!w.isStick){
    // Show proficiency information (now uses category), respecting Weapon Master which overrides category checks
    const hasWM = !!(S.tempEffects && S.tempEffects.weaponMaster);
    const good=S.hero?.good===w.category,bad=S.hero?.bad===w.category;
    let profText="No proficiency: ×1.0";
    let profClass="dim";
    if(hasWM){
      profText="Weapon Master active: ×2.0";
      profClass="positive";
    } else if(good){
      profText="Good proficiency: ×2.0";
      profClass="positive";
    } else if(bad){
      profText="Poor proficiency: ×0.5";
      profClass="negative";
    }
    lines.push(`<div class="tooltip-line ${profClass}">${profText}</div>`);
  }
  
  if(w.type==="affinity"||w.type==="noun"||(w.type==="adjective"&&w.elem!==undefined)){
    // Show combined hero vs enemy element interaction.  Determine the hero's stance (strong/neutral/weak)
    // and the enemy's stance (weak/neutral/strong) based on their respective arrays.  Then map the pair
    // to the correct multiplier following the simplified table:
    // Strong vs Weak → 3×; Strong vs Neutral or Neutral vs Weak → 2×;
    // Matching stances (both strong, both neutral, both weak) → 1×; otherwise → 0×.
    const el = w.elem;
    const heroStrong = S.hero?.str.includes(el);
    const heroWeak  = S.hero?.weak.includes(el);
    const enemyWeak  = S.enemy?.weak.includes(el);
    const enemyStrong = !(S.tempEffects && S.tempEffects.polymorph) && S.enemy?.res.includes(el);
    let multi = 1;
    let note  = '';
    if(heroStrong && enemyWeak){
      multi = 3;
      note  = 'Hero strong, enemy weak: ×3.0';
    } else if((heroStrong && !enemyWeak && !enemyStrong) || (!heroStrong && !heroWeak && enemyWeak)){
      multi = 2;
      note  = heroStrong ? 'Hero strong, enemy neutral: ×2.0' : 'Hero neutral, enemy weak: ×2.0';
    } else if((heroStrong && enemyStrong) || (!heroStrong && !heroWeak && !enemyWeak && !enemyStrong) || (heroWeak && enemyWeak)){
      multi = 1;
      // Provide context for stalemate
      note  = 'No advantage: ×1.0';
    } else {
      multi = 0;
      note  = 'No effect: ×0.0';
    }
    const cssClass = multi === 0 ? 'negative' : multi > 1 ? 'positive' : 'dim';
    lines.push(`<div class="tooltip-line ${cssClass}">${note}</div>`);
  }
  
  // Show multiplier line only for adjectives (affinity words no longer have inherent multipliers)
  if(w.mult && w.type !== "affinity"){
    lines.push(`<div class="tooltip-line">Multiplier: ×${w.mult}</div>`);
  }
  // Show baseline AP for all words.  Use explicit 'ap' if provided (e.g. gem nouns);
  // otherwise derive from rarity via our helper.  This keeps tier values consistent
  // with how AP is calculated in combat (T1=1, T2=2, T3=3).
  const tierAP = (w.ap !== undefined ? w.ap : rarityToAP(w.rarity));
  lines.push(`<div class="tooltip-line">Base AP: +${tierAP}</div>`);

  // Show morphological variants based on the WORD_FORMS mapping.  If a word has
  // prefix or suffix forms different from its own name, display them so the
  // player understands how the word will change when placed in different slots.
  const forms = WORD_FORMS[w.id];
  if(forms){
    const prefixVar = forms.prefix || w.name;
    const suffixVar = forms.suffix || w.name;
    // Only show if the prefix or suffix differ from the word's name to avoid clutter
    if(prefixVar !== w.name || suffixVar !== w.name){
      lines.push(`<div class="tooltip-line dim">Prefix form: ${prefixVar}</div>`);
      lines.push(`<div class="tooltip-line dim">Suffix form: ${suffixVar}</div>`);
    }
  }
  
  let elemBadge="";
  if(w.elem!==undefined){
    elemBadge=`<span class="tooltip-elem" style="background:${EC[w.elem]}33;color:${EC[w.elem]}">${EN[w.elem]}</span>`;
  }
  
  const typeParts = [tierLabel];
  if(elemBadge) typeParts.push(elemBadge);

  return `<div class="tooltip">
    <div class="tooltip-title ${rc}">${w.name}</div>
    <div class="tooltip-type">${typeParts.join(" ")}</div>
    ${lines.join("")}
  </div>`;
}

// Build a breakdown of all AP contributions and multipliers currently affecting the damage preview.
function buildMultiplierTooltip(){
  if(!S.sel.item) return '';
  const c = calc({ breakdown: true });
  const fmtNum=(v)=>Number.isInteger(v)?v:parseFloat(v.toFixed(2));
  const lines = [];

  lines.push('<div class="tooltip-title">Damage Breakdown</div>');
  lines.push('<div class="tooltip-line dim">AP Sources</div>');
  c.breakdown.base.forEach(line=>{
    lines.push(`<div class="tooltip-line">${line}</div>`);
  });
  if(c.breakdown.words.length){
    lines.push('<div class="tooltip-line dim">Word Modifiers</div>');
    c.breakdown.words.forEach(line=>{
      lines.push(`<div class="tooltip-line">${line}</div>`);
    });
  }
  lines.push(`<div class="tooltip-line"><strong>Total AP:</strong> ${fmtNum(c.baseAP)}</div>`);

  lines.push('<div class="tooltip-line dim">Word Count Factor</div>');
  lines.push(`<div class="tooltip-line">×${fmtNum(c.breakdown.wordCount)} effective words</div>`);

  lines.push('<div class="tooltip-line dim">Multipliers</div>');
  if(c.breakdown.multipliers.length){
    c.breakdown.multipliers.forEach(line=>{
      lines.push(`<div class="tooltip-line">${line}</div>`);
    });
  } else {
    lines.push('<div class="tooltip-line">×1.0 (none)</div>');
  }
  lines.push(`<div class="tooltip-line"><strong>Total Multiplier:</strong> ×${fmtNum(c.totalMultiplier)}</div>`);

  const finalDmg = c.heroDmg;
  lines.push('<div class="tooltip-line dim">Final</div>');
  lines.push(`<div class="tooltip-line"><strong>${finalDmg} damage</strong> = ${fmtNum(c.baseAP)} AP × ${fmtNum(c.breakdown.wordCount)} × ${fmtNum(c.totalMultiplier)}</div>`);

  return lines.join('');
}

function isWordDisabled(w,hasItem,hasNoun){
  // Basic rules:
  // 1. Require selecting a weapon first; non‑weapons are disabled until a weapon is chosen.
  if(w.type !== 'weapon' && !hasItem) return true;
  // 2. Only one weapon can be selected at a time (except the backup stick).
  if(w.type === 'weapon' && S.sel.item) return true;
  // Determine if all modifier slots are full (four adjective slots and one gem)
  const adjFull = !!(S.sel.adj1 && S.sel.adj2 && S.sel.adj3 && S.sel.adj4);
  const nounFull = !!S.sel.noun1;
  // 3. For all non‑weapons: disable only when no modifier slots are available.
  if(w.type !== 'weapon'){
    return adjFull && nounFull;
  }
  return false;
}

function clickWord(w){
  sfxClick();
  if(w.type === 'weapon'){
    // Selecting a weapon resets all modifier slots
    S.sel.item = w;
  } else {
    // For all non-weapons, fill the first available adjective slot, then the gem slot.
    if(!S.sel.adj1) S.sel.adj1 = w;
    else if(!S.sel.adj2) S.sel.adj2 = w;
    else if(!S.sel.adj3) S.sel.adj3 = w;
    else if(!S.sel.adj4) S.sel.adj4 = w;
    else if(!S.sel.noun1) S.sel.noun1 = w;
    else S.sel.adj1 = w;
  }
  render();
}

function createAuraAnimation(fromSlot, slotKey, word){
  // Create multiple aura particles that fly from the slot to the center weapon
  const weaponSvg = $("#weapon-svg");
  if(!weaponSvg || !fromSlot) return;

  // Get positions
  const fromRect = fromSlot.getBoundingClientRect();
  const toRect = weaponSvg.getBoundingClientRect();

  // Calculate center points
  const fromX = fromRect.left + fromRect.width / 2;
  const fromY = fromRect.top + fromRect.height / 2;
  const toX = toRect.left + toRect.width / 2;
  const toY = toRect.top + toRect.height / 2;

  // Calculate distance to travel
  const dx = toX - fromX;
  const dy = toY - fromY;

  // Determine color based on word type/element
  let color = '#a855f7'; // Default purple
  if(word.elem !== undefined){
    const elemColors = {
      [E.FIRE]: '#ef4444',
      [E.WATER]: '#3b82f6',
      [E.POISON]: '#22c55e',
      [E.LIGHT]: '#fbbf24',
      [E.DARK]: '#9333ea',
      [E.EARTH]: '#a16207',
      [E.LIGHTNING]: '#60a5fa',
      [E.PHYS]: '#6b7280'
    };
    color = elemColors[word.elem] || color;
  }

  // Create 3-5 particles for a nice effect
  const numParticles = 3 + Math.floor(Math.random() * 3);
  for(let i = 0; i < numParticles; i++){
    const particle = document.createElement('div');
    particle.className = 'aura-particle';
    particle.style.left = fromX + 'px';
    particle.style.top = fromY + 'px';
    particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
    particle.style.setProperty('--dx', dx + 'px');
    particle.style.setProperty('--dy', dy + 'px');

    // Slightly randomize timing for staggered effect
    particle.style.animationDelay = (i * 0.05) + 's';

    document.body.appendChild(particle);

    // Remove particle after animation completes
    setTimeout(() => {
      particle.remove();
    }, 800 + (i * 50));
  }
}

function setupEvents(){
  // Attach click handlers to each slot to support assigning selected words or removing existing ones.
  ["item","adj1","adj2","adj3","adj4","noun1"].forEach(k=>{
    const slot = document.querySelector(`[data-slot="${k}"].slot`);
    if(!slot) return;
    slot.onclick = () => {
      const selected = S.pendingWord;
      // If a word is selected from the bank, attempt to place it into this slot
      if(selected){
        // Only restrict weapons: they must occupy the weapon slot.  Non-weapons
        // cannot be placed into the weapon slot, and weapons cannot occupy other
        // slots.  Otherwise, allow placement freely; nouns, adjectives and
        // affinities can occupy any modifier slot.
        if(selected.type === 'weapon' && k !== 'item'){
          return;
        }
        if(selected.type !== 'weapon' && k === 'item'){
          return;
        }
        // If placing a weapon, clear all modifier slots
        if(k === 'item'){
          clrSel();
          S.sel.item = selected;
        } else {
          // Place the selected word into the chosen slot
          S.sel[k] = selected;
        }
        // Clear the selection and re-render UI
        S.pendingWord = null;

        // Add visual feedback when placing word
        slot.classList.add('word-placed');
        setTimeout(() => slot.classList.remove('word-placed'), 300);

        // Play a pleasant tone based on word rarity
        try{
          const tierIndex = RRANK[selected.rarity] || 0;
          const freq = 440 * Math.pow(2, tierIndex / 4);
          playTone(freq, 0.15, 'sine', 0.2);
        }catch(err){}

        // Trigger aura animation from slot to center weapon
        createAuraAnimation(slot, k, selected);

        render();
        return;
      }
      // If no word is selected, clicking a filled slot removes the word
      if(S.sel[k]){
        sfxRemove();
        S.sel[k] = null;
        // Removing the weapon clears all modifier slots and the noun
        if(k === 'item'){
          S.sel.adj1 = null; S.sel.adj2 = null; S.sel.adj3 = null; S.sel.adj4 = null;
          S.sel.noun1 = null;
        }
        render();
      }
    };
  });
}

function renderWeapon(target="#weapon-svg"){
  const svg=$(target),s=S.sel;
  if(!s.item){svg.innerHTML="";if(target==="#weapon-svg")$("#weapon-name").textContent="";return}
  
  const wt=s.item.isStick?"stick":s.item.id;
  const tmpl=WEAPON_SVG[wt];
  const baseCol=s.affinity?EC[s.affinity.elem]:BASE_COLORS[wt];
  // Use noun1 for gem color; adjectives come from any adjective slot
  const f1Col = s.noun1 ? EC[s.noun1.elem] : "transparent";
  const f2Col = s.adj1 || s.adj2 || s.adj3 || s.adj4 ? ((s.adj1 || s.adj2 || s.adj3 || s.adj4).elem !== undefined ? EC[(s.adj1 || s.adj2 || s.adj3 || s.adj4).elem] : "#f4d03f") : "transparent";
  
  let html=tmpl.base.replace(/BASECOLOR/g,baseCol);
  if(s.noun1 && tmpl.flair1) html += tmpl.flair1.replace(/FLAIR1COLOR/g, f1Col);
  // Use the first available adjective slot for flair2
  if((s.adj1 || s.adj2 || s.adj3 || s.adj4) && tmpl.flair2) html += tmpl.flair2.replace(/FLAIR2COLOR/g, f2Col);
  svg.innerHTML=html;
  
  if(target==="#weapon-svg"){
    const nm=buildWeaponName();
    $("#weapon-name").textContent=nm;
  }
}

// Render a partial weapon based on progress (0–1).  At 0, nothing is shown;
// between 0 and 0.66, only the weapon's base appears; between 0.66 and 1, the
// second flair (adjective flourish) is added; at 1.0, the gem flair is also
// added.  Colours are derived from the currently selected words (affinity,
// adjective, gem).  This helper is used during combat to visually build the
// weapon as each word is tallied.
function renderWeaponProgress(svgElem, progress){
  const s = S.sel || {};
  if(!svgElem) return;
  // If no weapon is selected, clear the SVG and return early
  if(!s.item){
    svgElem.innerHTML = '';
    return;
  }
  const wt = s.item.isStick ? 'stick' : s.item.id;
  const tmpl = WEAPON_SVG[wt];
  if(!tmpl){
    svgElem.innerHTML = '';
    return;
  }
  // Determine colours for base and flairs
  const baseCol = (s.affinity && s.affinity.elem !== undefined) ? EC[s.affinity.elem] : (BASE_COLORS[wt] || '#888');
  const f1Col = s.noun1 ? EC[s.noun1.elem] : 'transparent';
  const adj = s.adj1 || s.adj2 || s.adj3 || s.adj4;
  const f2Col = adj && adj.elem !== undefined ? EC[adj.elem] : (adj ? '#f4d03f' : 'transparent');
  let html = '';
  // Always show the base when any progress has been made
  if(progress > 0){
    html += tmpl.base.replace(/BASECOLOR/g, baseCol);
  }
  // Show the second flair once two‑thirds of progress has been reached
  if(progress >= 0.66 && tmpl.flair2){
    html += tmpl.flair2.replace(/FLAIR2COLOR/g, f2Col);
  }
  // Show the gem flair only when progress is complete
  if(progress >= 1.0 && tmpl.flair1){
    html += tmpl.flair1.replace(/FLAIR1COLOR/g, f1Col);
  }
  svgElem.innerHTML = html;
}

function buildWeaponName(){
  const s=S.sel;
  const parts=[];
  // Helper to get the display name for a word based on the slot it occupies. If a noun is
  // used in an adjective slot, convert it to its adjective form using the NOUN_TO_ADJ
  // mapping. Otherwise return the word's original name.
  function getDisplayName(word, slotKey){
    if(!word) return "";
    const forms = WORD_FORMS[word.id];
    if(slotKey.startsWith('adj')){
      return (forms && forms.prefix) || word.name;
    }
    if(slotKey.startsWith('noun')){
      return (forms && forms.suffix) || word.name;
    }
    return word.name;
  }

  // Order: adj1 adj2 weapon of [the] adj3 adj4 noun1
  if(s.adj1) parts.push(getDisplayName(s.adj1, 'adj1'));
  if(s.adj2) parts.push(getDisplayName(s.adj2, 'adj2'));
  if(s.item) parts.push(getDisplayName(s.item, 'item'));

  // If a gem is present, always include "of the" and then any adjectives
  // after the gem and the gem itself.  This removes ambiguity between
  // "of" and "of the" and makes the sentence structure consistent.
  if(s.noun1){
    parts.push('of the');
    if(s.adj3) parts.push(getDisplayName(s.adj3, 'adj3'));
    if(s.adj4) parts.push(getDisplayName(s.adj4, 'adj4'));
    parts.push(getDisplayName(s.noun1, 'noun1'));
  }
  return parts.join(' ');
}

// === CALCULATION WITH TALENT HOOKS ===
function getCombatants(){
  const defaultHero={hp:100,str:[],weak:[],good:null,bad:null,name:"Hero"};
  const defaultEnemy={hp:50,ap:0,weak:[],res:[],name:"Enemy"};
  if(!S.hero) console.warn("[combat] Missing hero data; using defaults");
  if(!S.enemy) console.warn("[combat] Missing enemy data; using defaults");
  return{
    hero:{...defaultHero,...(S.hero||{})},
    enemy:{...defaultEnemy,...(S.enemy||{})}
  };
}

function calc(opts={}){
  const wantBreakdown = !!opts.breakdown;
  const breakdown = wantBreakdown ? { base: [], words: [], multipliers: [], wordCount: 0 } : null;
  const {hero:h,enemy:e}=getCombatants();
  const s = S.sel;
  const hasTalent=(id)=>S.talents.includes(id);
  const hasWeaponMaster=!!(S.tempEffects && S.tempEffects.weaponMaster);
  const weakTo=(el)=>e.weak.includes(el);
  const resists=(el)=>!(S.tempEffects && S.tempEffects.polymorph) && e.res.includes(el);
  const fmtNum=(v)=>Number.isInteger(v)?v:parseFloat(v.toFixed(2));

  // Base AP starts at 0, only increased by talents
  let baseAP = 0;

  // [T3] Battle Hardened: +3 baseAP per round survived (permanent)
  if(hasTalent("battle_hardened")){
    baseAP += S.battleHardenedBonus;
    if(wantBreakdown && S.battleHardenedBonus){
      breakdown.base.push(`+${S.battleHardenedBonus} Battle Hardened`);
    }
  }

  // [T3] Word Hoarder: +1 AP for each word in inventory over 15
  if(hasTalent("word_hoarder") && S.inv.length > 15){
    baseAP += (S.inv.length - 15);
    if(wantBreakdown){
      breakdown.base.push(`+${S.inv.length - 15} Word Hoarder`);
    }
  }

  let wordCount = 0;
  let heroBonus = 1.0;
  let weaponWord = null;

  // Collect all selected words from slots (single gem slot)
  const allWords = [s.item, s.adj1, s.adj2, s.adj3, s.adj4, s.noun1].filter(Boolean);

  // [T1] Descriptive: +1 baseAP per adjective
  if(hasTalent("descriptive")){
    const adjCount = allWords.filter(w=>w.type==='adjective').length;
    baseAP += adjCount;
    if(wantBreakdown && adjCount){
      breakdown.base.push(`+${adjCount} Descriptive`);
    }
  }

  // [T3] Sharpening Stone: 25% chance to upgrade tier
  const tempTierBoost = {};
  if(hasTalent("sharpening_stone")){
    allWords.forEach((w,idx)=>{
      if(!w.isStick && Math.random() < 0.25){
        tempTierBoost[idx] = 1;
      }
    });
  }

  let wordBaseAPTotal = 0;
  // Reset weaponWord
  weaponWord = null;

  // We'll iterate over the fixed slot order to properly apply gem bonuses. This ensures
  // that nouns placed in the gem slot contribute extra AP.
  const slotKeys = ['item','adj1','adj2','adj3','adj4','noun1'];
  slotKeys.forEach((slotKey) => {
    const word = s[slotKey];
    if(!word) return;
    if(word.isStick){
      weaponWord = word;
      return;
    }
    // Determine tier value with possible temporary boost (Sharpening Stone) based on
    // position in allWords array. To ensure deterministic boost assignment, map
    // slotKey to an index into the allWords list that matches the previous
    // implementation order. We'll find the index of this word in allWords.
    let idx = allWords.indexOf(word);
    // Determine base AP for this word.  Use explicit 'ap' when defined (e.g. gem nouns);
    // otherwise derive from rarity via our helper.  Temporary boosts and talents will
    // modify this base value below.
    let tierValue = getBaseAP(word);
    // Apply a temporary tier boost (Sharpening Stone) if flagged for this index
    if(idx >= 0 && tempTierBoost[idx]) tierValue = Math.min(3, tierValue + 1);

    // [T2] Pyromancer: fire words count as one tier higher (cap at 3 AP)
    if(hasTalent('pyromancer') && word.elem === E.FIRE){
      tierValue = Math.min(3, tierValue + 1);
      if(wantBreakdown) breakdown.words.push(`+1 tier from Pyromancer (${word.name})`);
    }

    // [Joker] Scribe's Sigil: every word gains +1 base AP.  This applies before any
    // elemental or gem multipliers.  The effect stacks with other tier boosts.
    if(hasTalent('scribe_sigil')){
      tierValue += 1;
      if(wantBreakdown) breakdown.words.push(`+1 Scribe's Sigil (${word.name})`);
    }

    // Apply weapon proficiency to the weapon's AP (good proficiency doubles, poor halves)
    if(slotKey === 'item' && !word.isStick && word.category){
      if(hasWeaponMaster){
        tierValue = parseFloat((tierValue * 2.0).toFixed(2));
        if(wantBreakdown) breakdown.words.push(`×2.0 Weapon Master (${word.name})`);
      } else if(h.good === word.category){
        tierValue = parseFloat((tierValue * 2.0).toFixed(2));
        if(wantBreakdown) breakdown.words.push(`×2.0 Proficiency (${word.name})`);
      } else if(h.bad === word.category){
        tierValue = parseFloat((tierValue * 0.5).toFixed(2));
        if(wantBreakdown) breakdown.words.push(`×0.5 Poor Proficiency (${word.name})`);
      }
    }

    // Determine how this word contributes to base AP and the effective word count.
    // Elemental interactions combine both hero and enemy affinities:
    //  - If the hero is strong with the element and the enemy is weak to it, apply a 3× multiplier.
    //  - If either the hero is strong against a neutral enemy or the hero is neutral against a weak enemy, apply a 2× multiplier.
    //  - If both sides have the same stance (strong vs strong, neutral vs neutral, weak vs weak), apply a 1× multiplier.
    //  - If the hero is neutral against an enemy that resists the element or the hero is weak against a neutral/strong enemy, apply a 0× multiplier.
    let elemMult = 1;
    if(word.elem !== undefined){
      const heroStrong = h.str.includes(word.elem);
      const heroWeak  = h.weak.includes(word.elem);
      const enemyWeak  = e.weak.includes(word.elem);
      const enemyStrong = resists(word.elem);
      if(heroStrong && enemyWeak){
        elemMult = 3;
      } else if((heroStrong && !enemyWeak && !enemyStrong) || (!heroStrong && !heroWeak && enemyWeak)){
        elemMult = 2;
      } else if((heroStrong && enemyStrong) || (!heroStrong && !heroWeak && !enemyWeak && !enemyStrong) || (heroWeak && enemyWeak)){
        elemMult = 1;
      } else {
        // Cases: neutral vs strong OR weak vs neutral/strong
        elemMult = 0;
      }
    }

    // [Joker] Ember Focus: fire words deal ×1.5 damage.  Multiply the element multiplier
    // accordingly.  This does not override elemental immunity (0 multiplier remains 0).
    if(hasTalent('ember_focus') && word.elem === E.FIRE){
      elemMult *= 1.5;
      if(wantBreakdown) breakdown.words.push(`×1.5 Ember Focus (${word.name})`);
    }
    // Base AP contribution is the tier value times the element multiplier
    let apContribution = tierValue * elemMult;
    let wCountDelta    = elemMult;
    // Gem slot doubles AP contribution but does not affect word count
    if(slotKey === 'noun1'){
      apContribution *= 2;
      if(wantBreakdown) breakdown.words.push(`×2.0 Gem Bonus (${word.name})`);
    }
    wordBaseAPTotal += apContribution;
    wordCount += wCountDelta;

    if(wantBreakdown){
      const labels = [];
      if(word.elem !== undefined) labels.push(EN[word.elem]);
      if(slotKey === 'noun1') labels.push('Gem');
      if(word.category) labels.push(word.category);
      const suffix = labels.length ? ` (${labels.join(', ')})` : '';
      breakdown.base.push(`+${fmtNum(apContribution)} ${word.name}${suffix}`);
    }

    // Track weapon for proficiency display
    if(slotKey === 'item'){
      weaponWord = word;
    }
  });

  baseAP += wordBaseAPTotal;

  // Hero preference (proficiency) is now applied inline to the weapon's tierValue above

  // Calculate all multipliers for display purposes
  let totalMultiplier = 1.0;

  // Stick penalty: ×0.25 if using stick
  if(weaponWord && weaponWord.isStick){
    totalMultiplier *= 0.25;
    if(wantBreakdown) breakdown.multipliers.push('×0.25 Backup Stick');
  }

  // [T2] Forged in Flame: +25% if below 50% HP
  // This talent depends on hero HP; since hero HP is no longer used, this
  // multiplier only applies if HP mechanic is restored. We'll disable it by
  // skipping this check.

  // [T3] Dual Spec: ×2.0 if 2+ elements
  if(hasTalent('dual_spec')){
    const elems = new Set(allWords.filter(w=>w.elem!==undefined).map(w=>w.elem));
    if(elems.size >= 2){
      totalMultiplier *= 2.0;
      if(wantBreakdown) breakdown.multipliers.push('×2.0 Dual Spec');
    }
  }

  // [T3] Min-Max: +75% if only T1 or T3 (no T2)
  if(hasTalent('min_max')){
    const hasT2 = allWords.some(w=>!w.isStick && RRANK[w.rarity]===2);
    if(!hasT2 && allWords.length > 0){
      totalMultiplier *= 1.75;
      if(wantBreakdown) breakdown.multipliers.push('×1.75 Min‑Max');
    }
  }

  // Apply multiplier words (rarity multipliers such as Common through Legendary).  Adjectives in
  // adjective slots multiply the final total, but if an adjective is used as
  // the gem (noun1) it should behave like a noun and not apply its multiplier
  // again.  Check against the selected noun slot to avoid double dipping.
  allWords.forEach(word => {
    if(word.mult !== undefined && word.type === 'adjective' && word !== S.sel.noun1){
      totalMultiplier *= word.mult;
      if(wantBreakdown) breakdown.multipliers.push(`×${word.mult} ${word.name}`);
    }
  });

  // [Joker] Wordsmith's Fervor: final damage is multiplied by (1 + 0.1 per word used).  This
  // effect applies after all other multipliers, and scales based on the number of words
  // contributing damage (wordCount).  Only active when the talent is owned.
  if(hasTalent('wordsmiths_fervor')){
    const fervorMult = (1 + 0.1 * wordCount);
    totalMultiplier *= fervorMult;
    if(wantBreakdown) breakdown.multipliers.push(`×${fervorMult.toFixed(2)} Wordsmith's Fervor`);
  }

  // Final damage = base AP × word count × all multipliers
  let heroDmg = Math.floor(baseAP * wordCount * totalMultiplier);

  // For display: effective word count including multipliers
  let displayWordCount = Math.round(wordCount * totalMultiplier * 10) / 10;

  // Enemy does no damage in this simplified model
  let enemyDmg = 0;

  // Final HP values: hero HP not tracked; enemy HP decreases by hero damage
  const enemyMax = e.hp;
  const enemyFin = Math.max(0, enemyMax - heroDmg);

  if(wantBreakdown){
    breakdown.wordCount = wordCount;
  }

  return{
    heroDmg,
    enemyDmg,
    heroMax: h.hp,
    enemyMax,
    heroFin: h.hp,
    enemyFin,
    currentHP: S.currentHP,
    win: enemyFin <= 0,
    tie: false,
    baseAP,
    wordCount: displayWordCount,
    heroBonus,
    weaponType: weaponWord?.id || 'stick',
    allWords,
    totalMultiplier,
    breakdown
  };
}

function updPrev(){
  const v=!!S.sel.item;$("#forge-btn").disabled=!v;
  if(!v){
    // Without a weapon selected, show 0 damage
    const defMult=S.hero.str.includes(S.enemy.atk)?0.7:S.hero.weak.includes(S.enemy.atk)?1.5:1;
    $("#pv-hero").textContent="0";
    $("#pv-enemy").textContent=Math.round(S.enemy.ap*defMult);
    return;
  }
  const c=calc();
  $("#pv-hero").textContent=Math.round(c.heroDmg);
  $("#pv-enemy").textContent=Math.round(c.enemyDmg);

}

function updatePreviewStats(c) {
  // This can be expanded later to show detailed breakdown
  // For now, the main preview numbers are handled in updPrev
}

// === COMBAT ===
function forge(){
  sfxForgeStart();
  const c=calc();
  PStats.weaponsForged++;
  PStats.bestDamage=Math.max(PStats.bestDamage,Math.round(c.heroDmg||0));
  if(Object.values(S.sel).every(v=>v)) PStats.stackedCreations++;
  saveStats();
  saveRun();
  // No descriptive combat log: rely on slot calculation details for transparency
  renderWeapon("#combat-weapon-svg");

  // Build words display for combat animation. Instead of showing the full weapon name,
  // list each part of the phrase on its own line with its contribution. This improves
  // clarity by matching the forging UI order: adjectives before the weapon, the weapon
  // itself, the "of (the)" connector, the gem/suffix element, and adjectives after the
  // gem. Even if a gem is not present, "of (the)" is still displayed to reinforce the
  // expected structure.
  const words = [];
  const e = S.enemy;
  const resists = (el) => !(S.tempEffects && S.tempEffects.polymorph) && e.res.includes(el);

  // Helper to convert words for display based on slot.  All non-weapon words
  // use their prefix form when occupying an adjective slot and suffix form when
  // occupying the gem slot.  Weapons retain their own name.  If a slot is
  // empty, return null so nothing is pushed.
  function getDisplayForSlot(word, slotKey){
    if(!word) return null;
    // Stick: display separately with fixed multiplier text
    if(word.isStick){
      return { name: word.name, value: '', tooltip: '×0.25', rarity: -1, color: null };
    }
    // Determine the display name based on slot (prefix vs suffix)
    let displayName = word.name;
    const forms = WORD_FORMS[word.id];
    if(slotKey.startsWith('adj')){
      displayName = (forms && forms.prefix) || word.name;
    } else if(slotKey.startsWith('noun')){
      displayName = (forms && forms.suffix) || word.name;
    }

    // Check if this is a multiplier word (rarity-based adjectives).  When placed in the
    // gem slot (noun1), adjectives should behave like nouns and contribute AP rather
    // than acting as multipliers.  Only treat adjectives as multipliers in
    // non‑gem slots.
    if(word.mult !== undefined && word.type === 'adjective' && slotKey !== 'noun1'){
      return {
        name: displayName,
        value: '',
        tooltip: `×${word.mult}`,
        rarity: word.rarity,
        color: null
      };
    }

    // Base AP for this word (respecting explicit 'ap' or derived from rarity)
    let baseValue = getBaseAP(word);
    let displayValue = `+${baseValue}`;
    let color = null;

    // Element interactions: weakness doubles AP, resistance nullifies AP
    if(word.elem !== undefined){
      color = EC[word.elem];
      if(e.weak.includes(word.elem)){
        // Weakness doubles AP
        let weakVal = baseValue * 2;
        // Apply gem bonus (×2) if in gem slot (total ×4)
        if(slotKey === 'noun1'){
          displayValue = `+${weakVal * 2} (GEM+WEAK!)`;
        } else {
          displayValue = `+${weakVal} (WEAK!)`;
        }
      } else if(resists(word.elem)){
        // Resistance negates AP
        displayValue = `×0 (RES)`;
      } else {
        // Normal element, check for gem bonus
        if(slotKey === 'noun1'){
          displayValue = `+${baseValue * 2} (GEM)`;
        }
      }
    } else {
      // No element: gem slot still doubles base AP
      if(slotKey === 'noun1'){
        displayValue = `+${baseValue * 2} (GEM)`;
      }
    }
    return {
      name: displayName,
      value: '',
      tooltip: displayValue,
      rarity: word.rarity,
      color
    };
  }

  // Build phrase order: pre-adjectives, weapon, of (the), gem, post-adjectives
  const preAdjs = ['adj1','adj2'];
  const postAdjs = ['adj3','adj4'];
  // Pre-adjectives
  preAdjs.forEach(k=>{
    const wordObj = S.sel[k];
    const entry = getDisplayForSlot(wordObj, k);
    if(entry) words.push({ ...entry, intensity: 1.0 });
  });
  // Weapon
  if(S.sel.item){
    const w = S.sel.item;
    // Determine the weapon's base AP (respect explicit 'ap' if present) and build the display value
    let baseValue = getBaseAP(w);
    let displayValue = `+${baseValue}`;
    let color = null;
    if(w.elem !== undefined){
      color = EC[w.elem];
      if(e.weak.includes(w.elem)){
        displayValue = `+${baseValue * 2} (WEAK!)`;
      } else if(resists(w.elem)){
        displayValue = `×0 (RES)`;
      }
    }
    words.push({
      name: w.name,
      value: '',
      tooltip: displayValue,
      rarity: w.rarity,
      intensity: 1.0,
      color
    });
  }
  // Only show "of the" if there's at least one gem or post-adjective
  const hasGem = S.sel.noun1 !== null;
  const hasPostAdj = S.sel.adj3 !== null || S.sel.adj4 !== null;

  if(hasGem || hasPostAdj){
    // Insert the "of the" connector line.  It has no AP value but helps
    // the player visualize the expected placement of the gem.  The rarity is set
    // to 3 for styling purposes.
    words.push({
      name: 'of the',
      value: '',
      rarity: 3,
      intensity: 1.0,
      color: null
    });
  }

  // Post-adjectives appear immediately after the connector
  postAdjs.forEach(k => {
    const wordObj = S.sel[k];
    const entry = getDisplayForSlot(wordObj, k);
    if(entry) words.push({ ...entry, intensity: 1.0 });
  });

  // Gem / suffix element appears after post‑adjectives.  If a gem is present,
  // display it; otherwise, if we inserted the connector because of a gem or post‑adj,
  // show a placeholder for the gem slot.
  const gemEntry = getDisplayForSlot(S.sel.noun1, 'noun1');
  if(gemEntry) {
    words.push({ ...gemEntry, intensity: 1.0 });
  } else if(hasGem || hasPostAdj) {
    words.push({
      name: 'Gem',
      value: '',
      rarity: 0,
      intensity: 1.0,
      color: null
    });
  }

  // Append summary line at the end with the math shown as subdued subtext
  words.push({
    name: `${Math.round(c.heroDmg)} AP total`,
    value: `${c.baseAP} [AP] x ${c.wordCount} words`,
    rarity: 3,
    intensity: 1.5,
    valueClass: 'math-subtext',
    tooltip: `${c.baseAP} [AP] x ${c.wordCount} words`
  });

  // Calculate rewards before combat for display purposes
  const rewards = {
    gold: 0,
    items: []
  };

  const {enemy:safeEnemy}=getCombatants();
  const targetHp = safeEnemy.hp || 0;

  if(c.heroDmg >= targetHp){
    // Victory - calculate gold
    const overkill = Math.max(0, Math.round(c.heroDmg - targetHp));
    let goldReward = 15 + S.streak * 5;
    goldReward += Math.floor(overkill / 10);

    // [T2] Loot Goblin
    rewards.gold = goldReward;

    // Boss loot
    const isBoss = (S.roundIndex % 3 === 0);
    if(isBoss){
      // Preview what loot will be granted (1 weapon + 3 random words)
      const weapons = WORDS.filter(w => w.type === 'weapon');
      const randWeapon = weapons[Math.floor(Math.random() * weapons.length)];
      rewards.items.push(randWeapon.name);

      const nonWeapons = WORDS.filter(w => w.type !== 'weapon');
      for(let i = 0; i < 3; i++){
        const randWord = nonWeapons[Math.floor(Math.random() * nonWeapons.length)];
        rewards.items.push(randWord.name);
      }
    }
  }

  // Consume the used words from inventory (except stick)
  Object.values(S.sel).filter(Boolean).forEach(w=>{
    if(!w.isStick){
      const i = S.inv.indexOf(w);
      if(i >= 0) S.inv.splice(i,1);
    }
  });

  showCombat(c, words, rewards);
}

function afterCombat(){
  const lastResult=window.lastCombatResult;
  $("#combat-overlay").classList.remove("show");
  S.tempEffects={};

  const hasTalent=(id)=>S.talents.includes(id);

  if(lastResult.win){
    // Victory: level up, gain gold, proceed
    S.wins++;S.streak++;
    if(S.roundIndex>=9){
      PStats.victories++;
      if(S.hero && S.hero.name) PStats.heroClears[S.hero.name]=true;
      saveStats();
    }

    // Base gold reward
    let reward=15+S.streak*5;

    // Overkill bonus: award 1 gold per 10 damage beyond enemy HP
    const overkill=Math.max(0,Math.round(lastResult.heroDmg-lastResult.enemyMax));
    reward+=Math.floor(overkill/10);

    // [T1] Golden Touch: +3 gold after each victory
    if(hasTalent("golden_touch")){
      reward += 3;
    }

    // [T3] Treasure Hunter: gain gold equal to 20% of overkill damage
    if(hasTalent("treasure_hunter")){
      reward += Math.floor(overkill * 0.2);
    }

    S.gold += reward;

    // [T3] Battle Hardened: Each round survived: +3 base AP (permanent)
    if(hasTalent("battle_hardened")){
      S.battleHardenedBonus += 3;
    }

    // Level up
    S.level++;

    // Delivery of goods: grant the player a free pack of 1 weapon and 3 random words ONLY after boss victories.
    // Bosses occur at rounds 3, 6, 9, etc. (every 3rd round).
    // Only add the items if there is enough inventory space.  Words are selected with
    // a simple weighted rarity: common words are more likely than higher tiers.
    const isBoss = (S.roundIndex % 3 === 0);
    if(isBoss){
      const deliveryCount = 4;
      if(S.inv.length + deliveryCount <= INV_LIMIT){
        // Select one random weapon with T1=60%, T2=30%, T3=10% distribution
        const weapons = WORDS.filter(w => w.type === 'weapon');
        const weaponWeighted = [];
        weapons.forEach(w => {
          const rank = RRANK[w.rarity] || 0;
          // Apply weights: T1×6, T2×3, T3×1 (6:3:1 ratio)
          const weight = rank === 0 ? 6 : rank === 2 ? 3 : 1;
          for(let i = 0; i < weight; i++) weaponWeighted.push(w);
        });
        const randWeapon = weaponWeighted[Math.floor(Math.random() * weaponWeighted.length)];
        S.inv.push({ ...randWeapon });
        // Build a weighted list of non‑weapon words.  Rarity weighting: T1=60%, T2=30%, T3=10%
        // Using weights: T1 ×6, T2 ×3, T3 ×1 (6:3:1 ratio = 60%:30%:10%)
        const nonWeapons = WORDS.filter(w => w.type !== 'weapon');
        const weighted = [];
        nonWeapons.forEach(w => {
          const rank = RRANK[w.rarity] || 0;
          // Apply weights: T1×6, T2×3, T3×1 (6:3:1 ratio)
          const weight = rank === 0 ? 6 : rank === 2 ? 3 : 1;
          for(let i = 0; i < weight; i++) weighted.push(w);
        });
        for(let i = 0; i < 3; i++){
          const randWord = weighted[Math.floor(Math.random() * weighted.length)];
          S.inv.push({ ...randWord });
        }
      }
    }

    // Proceed to the next round.  If roundIndex exceeds 9 (i.e. after defeating
    // the round 9 boss), end the game to provide a clean vertical slice.  Otherwise
    // continue on to the shop.  The talent selection overlay remains disabled.
    S.roundIndex++;
    if(S.roundIndex > 9){
      alert("Congratulations! You have defeated the final boss and completed the game! Starting a new run...");
      startNewRun();
      return;
    }
    showShop();
  }else{
    // Defeat: run ends
    S.losses++;S.streak=0;
    S.heroSelected=false;
    clearRunSave();
    alert("Defeat! Your run has ended. Returning to the main menu.");
    showMainMenu();
    clrSel();
  }
}

function showTalentSelect(){
  // Pick 3 random talents that the player doesn't already have
  const availableTalents = TALENTS.filter(t => !S.talents.includes(t.id));

  if(availableTalents.length === 0){
    // No more talents to choose from, go to shop
    showShop();
    return;
  }

  const choices = shuf([...availableTalents]).slice(0, Math.min(3, availableTalents.length));

  $("#talent-level").textContent = S.level;

  const container = $("#talent-choices");
  container.innerHTML = "";

  choices.forEach(talent => {
    const div = document.createElement("div");
    div.className = "talent-choice";
    div.style.cssText = "border:2px solid #666;padding:12px;border-radius:8px;cursor:pointer;transition:all 0.2s";

    // Tier colors
    const tierColors = {1: "#4d99ff", 2: "#9966cc", 3: "#ff6633"};
    const tierColor = tierColors[talent.tier] || "#666";

    div.title = talent.desc; // Add tooltip

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:16px;font-weight:bold;color:${tierColor}">${talent.name}</div>
        <div style="font-size:11px;padding:2px 6px;background:${tierColor};color:#000;border-radius:4px">T${talent.tier}</div>
      </div>
      <div style="font-size:13px;line-height:1.4;color:#ccc">${talent.desc}</div>
    `;

    div.onmouseenter = () => {
      div.style.borderColor = tierColor;
      div.style.transform = "scale(1.02)";
    };
    div.onmouseleave = () => {
      div.style.borderColor = "#666";
      div.style.transform = "scale(1)";
    };

    div.onclick = () => {
      S.talents.push(talent.id);
      $("#talent-overlay").classList.remove("show");
      showShop();
    };

    container.appendChild(div);
  });

  $("#talent-overlay").classList.add("show");
}

async function showCombat(r,words,rewards){
  const {hero:safeHero,enemy:safeEnemy}=getCombatants();
  const safeResult={
    heroDmg:0,
    enemyDmg:0,
    heroMax:safeHero.hp,
    enemyMax:safeEnemy.hp,
    heroFin:safeHero.hp,
    enemyFin:safeEnemy.hp,
    currentHP:S.currentHP ?? safeHero.hp,
    win:false,
    tie:false,
    ...r
  };
  const safeRewards={
    gold:(rewards&&typeof rewards.gold==='number')?rewards.gold:0,
    items:Array.isArray(rewards?.items)?rewards.items:[]
  };

  window.lastCombatResult=safeResult; // Store for afterCombat
  window.lastCombatRewards=safeRewards; // Store rewards for display

  const ov=$("#combat-overlay");
  const cw=$("#combat-words");
  const total=$("#combat-total");
  const flames=$("#combat-flames");
  const weaponSvg=$("#combat-weapon-svg");
  const cbHero=$("#cb-hero"),cbEnemy=$("#cb-enemy");
  const barHero=$("#bar-hero"),barEnemy=$("#bar-enemy");
  const txtHero=$("#txt-hero"),txtEnemy=$("#txt-enemy");
  const resultBox=$("#combat-result");
  const resultTitle=$("#combat-result-title");
  const resultDetail=$("#combat-result-detail");

  if(!ov||!cw||!total||!flames||!weaponSvg||!cbHero||!cbEnemy||!barHero||!barEnemy||!txtHero||!txtEnemy){
    console.warn("[combat] Missing combat DOM; skipping animation");
    return;
  }

  cw.innerHTML="";
  total.classList.remove("show");
  total.textContent="";
  flames.style.opacity="0";
  weaponSvg.style.transform="";
  // Hide the new-run button at the start of combat
  const newRunBtnInit=document.getElementById("combat-new-run");
  if(newRunBtnInit) newRunBtnInit.style.display="none";
  // Compute how many parts of the weapon need to be built based on selected words
  var relevantCount=[S.sel.item,S.sel.adj1,S.sel.adj2,S.sel.adj3,S.sel.adj4,S.sel.noun1].filter(Boolean).length;
  // Track progress of displayed parts
  var progressSeen=0;
  // Begin with an empty weapon SVG
  renderWeaponProgress(weaponSvg,0);

  cbHero.textContent="0";cbEnemy.textContent="0";
  const heroStartHP=safeResult.currentHP;
  const heroPercent=(heroStartHP/safeResult.heroMax)*100;
  barHero.style.width=`${heroPercent}%`;
  barEnemy.style.width="100%";
  txtHero.textContent=`${heroStartHP}/${safeResult.heroMax}`;
  txtEnemy.textContent=`${safeResult.enemyMax}/${safeResult.enemyMax}`;
  $("#combat-result").style.display="none";
  ov.classList.add("show");
  const continueBtn=document.getElementById("combat-continue");
  const strayNewRun=document.getElementById("combat-new-run");

  // Ensure only the Continue button is shown on the combat result modal.
  if(strayNewRun) strayNewRun.remove();

  if(continueBtn){
    continueBtn.style.display="none";
    continueBtn.disabled=true;
  }

  try{
    cw.innerHTML="";
    total.classList.remove("show");
    total.textContent="";
    flames.style.opacity="0";
    weaponSvg.style.transform="";
    // Compute how many parts of the weapon need to be built based on selected words
    var relevantCount=[S.sel.item,S.sel.adj1,S.sel.adj2,S.sel.adj3,S.sel.adj4,S.sel.noun1].filter(Boolean).length;
    // Track progress of displayed parts
    var progressSeen=0;
    // Begin with an empty weapon SVG
    renderWeaponProgress(weaponSvg,0);

    $("#cb-hero").textContent="0";$("#cb-enemy").textContent="0";
    const heroStartHP=r.currentHP;
    const heroPercent=(heroStartHP/r.heroMax)*100;
    $("#bar-hero").style.width=`${heroPercent}%`;
    $("#bar-enemy").style.width="100%";
    $("#txt-hero").textContent=`${heroStartHP}/${r.heroMax}`;
    $("#txt-enemy").textContent=`${r.enemyMax}/${r.enemyMax}`;
    if(resultBox) resultBox.style.display="none";
    ov.classList.add("show");

    await dly(300);

    words.forEach(w=>{
      const div=document.createElement("div");
      div.className="combat-word";
      if(w.tooltip){
        div.setAttribute("title", w.tooltip);
      }
      const rc=w.rarity>=0?RC[w.rarity]:(w.rarity===-1?"rarity-rusty":"");
      const valueClass = w.valueClass ? ` combat-word-value ${w.valueClass}` : "combat-word-value";
      div.innerHTML=`<div class="combat-word-name ${rc}" ${w.color?`style=\"color:${w.color}\"`:''}>${w.name}</div>${w.value?`<div class="${valueClass}">${w.value}</div>`:''}`;
      cw.appendChild(div);
    });

    const wordEls=[...cw.querySelectorAll(".combat-word")];

    for(let i=0;i<wordEls.length;i++){
      const w=words[i],el=wordEls[i];
      await dly(400);

      el.classList.add("show");
      // Play ascending tone sequence for each word (pleasant arpeggio)
      try{
        const freq=440*Math.pow(2,i/(wordEls.length*1.5));
        playTone(freq,0.25,'sine',0.18);
      }catch(err){}

      if(w.intensity>0.3){
        el.classList.add("impact");
        // Removed sfxImpact to prevent dual sound effects - only keep the ascending tone
        weaponSvg.style.animation="weaponShake .3s ease-out";
        setTimeout(()=>weaponSvg.style.animation="",300);

        if(w.intensity>1){
          document.body.classList.add("shake");
          setTimeout(()=>document.body.classList.remove("shake"),150);
          spawnFlames(3+Math.floor(w.intensity*2));
        }
      }

      await dly(200);
      el.classList.remove("impact");
      // Gradually build the weapon SVG as relevant words are processed.  Only the
      // actual selected words (item, adjectives, gem) count towards the build.
      if(progressSeen < relevantCount){
        progressSeen++;
        const progressRatio = progressSeen / Math.max(relevantCount, 1);
        renderWeaponProgress(weaponSvg, progressRatio >= 1 ? 1.0 : progressRatio);
      }
    }

    await dly(400);
    flames.style.opacity="0.5";
    spawnFlames(10);
    setTimeout(()=>document.body.classList.remove("shake"),150);

    total.textContent=`${Math.round(r.heroDmg)} DAMAGE!`;
    total.classList.add("show");

    // Play a final note that continues the ascending arpeggio sequence rather than
    // jumping to a fixed pitch.  Compute the next frequency based on the number
    // of words displayed so the ending tone feels like a natural continuation.
    try{
      const totalWords = wordEls.length;
      // Use the same exponent growth used in the ascending loop: freq = 440×2^(i/(n*1.5))
      // For the final note, let i = n (next position).  This produces a gentle rise.
      const nextFreq = 440 * Math.pow(2, totalWords / (totalWords * 1.5));
      playTone(nextFreq, 0.4, 'sine', 0.3);
    }catch(err){}

    await dly(800);
    flames.style.opacity="0";

    await dly(300);
    await anim($("#cb-hero"),0,r.heroDmg,500);
    await dly(150);
    await anim($("#cb-enemy"),0,r.enemyDmg,350);
    await dly(300);

    $("#bar-hero").style.width=`${(r.heroFin/r.heroMax)*100}%`;
    $("#bar-enemy").style.width=`${(r.enemyFin/r.enemyMax)*100}%`;
    await anim($("#txt-hero"),heroStartHP,r.heroFin,400,v=>`${Math.round(v)}/${r.heroMax}`);
    await anim($("#txt-enemy"),r.enemyMax,r.enemyFin,400,v=>`${Math.round(v)}/${r.enemyMax}`);
    await dly(250);

    if(resultBox) resultBox.className="";
    if(resultBox) resultBox.style.display="block";
    if(r.win){
      if(resultBox) resultBox.classList.add("win");
      if(resultTitle){
        resultTitle.textContent="⚔️ VICTORY!";
        resultTitle.style.color="#4ade80";
      }

      // Show rewards
      let detailText = "Enemy defeated!";
      if(rewards && rewards.gold > 0){
        detailText += `
💰 +${rewards.gold} Gold`;
      }
      if(rewards && rewards.items.length > 0){
        detailText += `
🎁 Boss Loot: ${rewards.items.join(", ")}`;
      }
      if(resultDetail){
        resultDetail.textContent=detailText;
        resultDetail.style.whiteSpace="pre-line"; // Allow newlines
      }
      sfxWin();
    }else if(r.tie){
      if(resultBox) resultBox.classList.add("lose");
      if(resultTitle){
        resultTitle.textContent="💀 DRAW";
        resultTitle.style.color="#f59e0b";
      }
      if(resultDetail) resultDetail.textContent="Both fell...";
      sfxLose();
    }else{
      if(resultBox) resultBox.classList.add("lose");
      if(resultTitle){
        resultTitle.textContent="💀 DEFEAT";
        resultTitle.style.color="#f87171";
      }
      if(resultDetail) resultDetail.textContent="The enemy won...";
      sfxLose();
    }
    // No text log appended; calculation details are available via slot indicators
    render();
  }catch(err){
    console.error(err);
    if(resultBox){
      resultBox.className="lose";
      resultBox.style.display="block";
    }
    if(resultTitle){
      resultTitle.textContent="⚠️ Combat Error";
      resultTitle.style.color="#f59e0b";
    }
    if(resultDetail){
      resultDetail.textContent="Something went wrong resolving combat. You can continue to keep playing.";
      resultDetail.style.whiteSpace="pre-line";
    }
  }finally{
    // Reveal the continue button now that combat has resolved (even on error)
    if(continueBtn){
      continueBtn.style.display="block";
      continueBtn.disabled=false;
      continueBtn.focus();
    }
  }
}

function spawnFlames(count){
  const container=$("#combat-flames");
  for(let i=0;i<count;i++){
    const f=document.createElement("div");
    f.className="flame-particle";
    f.style.left=Math.random()*100+"%";
    f.style.bottom="0";
    f.style.animationDuration=(0.6+Math.random()*0.6)+"s";
    container.appendChild(f);
    setTimeout(()=>f.remove(),1200);
  }
}

// === SHOP ===
let shopCrates=[],shopBuffCrates=[],shopConsumables=[];
function showShop(){
  S.rerollCost=5;
  rollShop();
  renderShop();
  saveRun();
  $("#shop-overlay").classList.add("show");
}

function rollShop(){
  // Create 4 mystery crates with custom quantities and prices. Weapons crates
  // contain 2 weapons for 15g. Affinity crates and adjective crates contain
  // 3 words for 20-25g. Gem crates contain 3 nouns for 30g. Each crate defines
  // a quantity of words (qty) to include. When purchased, the specified number
  // of random words of that type will be added to the player's inventory.
  shopCrates = [];

  // Define two crate types: one for weapons and one for all other words.  The
  // modifier crate includes affinities, adjectives, and nouns.  This reduces
  // complexity and reflects the new unified word system.
  const crateTypes = [
    {type: 'weapon', name: 'Weapon Crate', price: 15, qty: 2, filter: w => w.type === 'weapon'},
    {type: 'modifier', name: 'Word Crate', price: 25, qty: 3, filter: w => w.type !== 'weapon'}
  ];

  crateTypes.forEach(crateType => {
    let availableWords = WORDS.filter(crateType.filter);
    // Apply rarity weights: T1=60%, T2=30%, T3=10% (6:3:1 ratio)
      const weightedPool = [];
      availableWords.forEach(w => {
        const rank = RRANK[w.rarity] || 0;
        // T1 (rank 0) appears 6 times, T2 (rank 2) appears 3 times, T3 (rank ≥3) appears once
        const weight = rank === 0 ? 6 : rank === 2 ? 3 : 1;
        for(let i = 0; i < weight; i++) weightedPool.push(w);
      });
      availableWords = weightedPool;
    // Determine quantity.  Bulk Discount talent adds +1 to all crate quantities.
    let qty = crateType.qty;
    if(S.talents && S.talents.includes('bulk_discount')){
      qty += 1;
    }
    const crateWords = shuf([...availableWords]).slice(0, qty);
    shopCrates.push({
      type: crateType.type,
      name: crateType.name,
      words: crateWords,
      price: crateType.price,
      // Store the computed quantity so UI and purchase logic reflect the Bulk Discount talent
      qty: qty
    });
  });

  // Select consumables at random.
  shopConsumables = shuf([...CONSUMABLES]).slice(0,3);

  // Buff crates disabled while talents are removed.
  shopBuffCrates = [];
}

function renderShop(){
  // Update gold display and show current inventory count under the shop title
  $("#shop-gold").textContent = `(💰${S.gold})`;
  const invEl = document.getElementById("shop-inventory");
  if(invEl){
    // Show just the count since the label is now part of the header
    invEl.textContent = `${S.inv.length}/${INV_LIMIT}`;
  }
  const conEl = document.getElementById("shop-consumable-cap");
  if(conEl){
    conEl.textContent = `${S.consumables.length}/${CONSUMABLE_LIMIT}`;
    conEl.classList.toggle("at-limit", S.consumables.length>=CONSUMABLE_LIMIT);
  }
  $("#reroll-cost").textContent=S.rerollCost;
  $("#reroll-btn").disabled=S.gold<S.rerollCost;

  // Populate hero info within the shop.  Display the hero's strengths, weaknesses
  // and weapon proficiencies so players know what to keep or sell.
  const heroInfo = document.getElementById("shop-hero-info");
  if(heroInfo){
    if(!S.hero){
      heroInfo.textContent = '';
  } else {
      const h = S.hero;
      // Build strings of elemental names for strengths and weaknesses
      const strongNames = h.str.map(i => EN[i]).join(', ') || 'None';
      const weakNames   = h.weak.map(i => EN[i]).join(', ') || 'None';
      // Weapon proficiency: good vs bad categories (capitalized)
      const goodProf = h.good ? (h.good.charAt(0).toUpperCase() + h.good.slice(1)) : 'None';
      const badProf  = h.bad ? (h.bad.charAt(0).toUpperCase() + h.bad.slice(1)) : 'None';
      heroInfo.innerHTML =
        `<div><span class="dim">Name:</span> <span style="color:#fb923c;font-weight:bold">${h.name}</span></div>`+
        `<div><span class="dim">Strong using:</span> <span style="color:#4ade80">${strongNames}</span></div>`+
        `<div><span class="dim">Weak using:</span> <span style="color:#f87171">${weakNames}</span></div>`+
        `<div><span class="dim">Good weapon:</span> <span style="color:#60a5fa">${goodProf}</span></div>`+
        `<div><span class="dim">Poor weapon:</span> <span style="color:#9ca3af">${badProf}</span></div>`;
    }
  }

  // Preview next enemy
  renderNextEnemyPreview();

  renderShopCrates();
  renderShopBuffCrates();
  renderShopWordBank();
  renderShopTalents();
  renderShopConsumables();
}

function renderNextEnemyPreview(){
  // Calculate what the next enemy will be
  const nextRound = S.roundIndex;
  if(!S.nextEnemy){
    const roll = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
    S.nextEnemy = roll ? roll.id : null;
  }
  const baseEnemy = ENEMIES.find(en=>en.id===S.nextEnemy) || ENEMIES[0];
  const previewEnemy = {...baseEnemy};

  // Apply HP scaling
  // Preview uses the same scaling as combat.  See hpScaling above for comments.
  const hpScaling = [5,15,30,55,85,130,180,240,300];
  const roundIdx = Math.min(nextRound - 1, hpScaling.length - 1);
  previewEnemy.hp = hpScaling[roundIdx];

  // Apply AP scaling
  previewEnemy.ap = 15 + (nextRound - 1) * 5;

  // Check if boss
  const isBoss = nextRound % 3 === 0;
  if(isBoss){
    previewEnemy.hp = Math.round(previewEnemy.hp * 1.3);
    previewEnemy.ap = Math.round(previewEnemy.ap * 1.2);
    previewEnemy.name = "[BOSS] " + previewEnemy.name;
  }

  // Update UI - format same as HERO INFO with colors
  const enemyPreview = $("#next-enemy-preview");
  if(enemyPreview){
    const weakNames = previewEnemy.weak && previewEnemy.weak.length > 0
      ? previewEnemy.weak.map(e=>EN[e]).join(', ')
      : 'None';
    const resNames = previewEnemy.res && previewEnemy.res.length > 0
      ? previewEnemy.res.map(e=>EN[e]).join(', ')
      : 'None';

    enemyPreview.innerHTML =
      `<div><span class="dim">Name:</span> <span style="color:#fb923c;font-weight:bold">${previewEnemy.name}</span></div>`+
      `<div><span class="dim">HP:</span> <span style="color:#fbbf24">${previewEnemy.hp}</span></div>`+
      `<div><span class="dim">Weak to:</span> <span style="color:#4ade80">${weakNames}</span></div>`+
      `<div><span class="dim">Resists:</span> <span style="color:#f87171">${resNames}</span></div>`;
  }
}

function renderShopCrates(){
  const cont = $("#shop-crates");
  cont.innerHTML = "";

  shopCrates.forEach((crate, i) => {
    const d = document.createElement("div");
    d.className = "shop-item";
    d.style.cssText = "min-width:150px;max-width:180px";

    // Crate type icons and colors.  Only two crate types remain: weapon and modifier.
    const crateIcons = {
      weapon: {icon: '⚔️', color: '#f87171'},
      modifier: {icon: '📝', color: '#60a5fa'}
    };

    const crateInfo = crateIcons[crate.type] || {icon: '📦', color: '#9ca3af'};

    // Determine effective price after any shop discount talents.  Bargain Hunter reduces cost by 20%,
    // Merchant Guild reduces cost by 50%.  If both are present, their effects stack multiplicatively.
    const hasTalent = (id) => S.talents.includes(id);
    let effectivePrice = crate.price;
    if(hasTalent('merchant_guild')){
      effectivePrice = Math.ceil(effectivePrice * 0.5);
    }
    if(hasTalent('bargain_hunter')){
      effectivePrice = Math.ceil(effectivePrice * 0.8);
    }
    d.innerHTML = `
      <div style="font-size:32px;margin-bottom:8px">${crateInfo.icon}</div>
      <div style="font-size:14px;font-weight:bold;color:${crateInfo.color};margin-bottom:6px">${crate.name}</div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:8px">Mystery Box<br>${crate.qty} Random ${crate.type === 'modifier' ? 'words' : crate.type + (crate.qty>1?'s':'')}</div>
      <div class="shop-price gold">💰${effectivePrice}</div>
      <button class="shop-btn" ${S.gold < effectivePrice ? "disabled" : ""}>Buy Crate</button>
    `;

    const buyBtn = d.querySelector("button");
    // Play hover sound on crate buy button
    buyBtn.onmouseenter = sfxHover;
    buyBtn.onclick = () => {
      // Compute effective price again inside the click handler to avoid closure issues
      let priceToPay = crate.price;
      if(hasTalent('merchant_guild')) priceToPay = Math.ceil(priceToPay * 0.5);
      if(hasTalent('bargain_hunter')) priceToPay = Math.ceil(priceToPay * 0.8);
      // Verify sufficient gold
      if(S.gold >= priceToPay){
        // Check if there's space for the crate's quantity of words
        const needed = crate.qty;
        if(S.inv.length + needed > INV_LIMIT){
          alert(`Not enough inventory space! Need ${needed - (INV_LIMIT - S.inv.length)} more slot(s).`);
          return;
        }
        sfxBuy();
        // [T2] Ninja Loot: 20% chance for free crate
        const isFree = hasTalent('ninja_loot') && Math.random() < 0.20;
        if(!isFree){
          S.gold -= priceToPay;
        }
        // Add the crate's words to inventory. If the crate's word list has fewer
        // than qty items (due to filtering), select random additional words of
        // the same type to fill the gap.
        let wordsToAdd = crate.words;
        if(wordsToAdd.length < crate.qty){
          const availableWords = WORDS.filter(w => w.type === crate.type);
          const neededExtras = crate.qty - wordsToAdd.length;
          const extras = shuf([...availableWords]).slice(0, neededExtras);
          wordsToAdd = [...wordsToAdd, ...extras];
        }
        wordsToAdd.forEach(w => {
          S.inv.push({ ...w });
        });
        shopCrates.splice(i, 1);
        renderShop();
        render();
      }
    };

    cont.appendChild(d);
  });

  if(shopCrates.length === 0){
    cont.innerHTML = '<div class="dim" style="padding:10px;font-size:11px">Sold out!</div>';
  }
}

function renderShopBuffCrates(){
  const cont = $("#shop-buff-crates");
  cont.innerHTML = "";

  shopBuffCrates.forEach((crate, i) => {
    const d = document.createElement("div");
    d.className = "shop-item";
    d.style.cssText = "min-width:150px;max-width:180px";

    // Determine effective price with shop discount talents
    const hasTalent = (id) => S.talents.includes(id);
    let effectivePrice = crate.price;
    if(hasTalent('merchant_guild')){
      effectivePrice = Math.ceil(effectivePrice * 0.5);
    }
    if(hasTalent('bargain_hunter')){
      effectivePrice = Math.ceil(effectivePrice * 0.8);
    }
    d.innerHTML = `
      <div style="font-size:32px;margin-bottom:8px">✨</div>
      <div style="font-size:14px;font-weight:bold;color:#a855f7;margin-bottom:6px">${crate.name}</div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:8px">Choose 1 of 3<br>Buffs</div>
      <div class="shop-price gold">💰${effectivePrice}</div>
      <button class="shop-btn" ${S.gold < effectivePrice ? "disabled" : ""}>Buy Crate</button>
    `;

    const buyBtn = d.querySelector("button");
    buyBtn.onmouseenter = sfxHover;
    buyBtn.onclick = () => {
      // Compute effective price again inside click handler
      let priceToPay = crate.price;
      if(hasTalent('merchant_guild')) priceToPay = Math.ceil(priceToPay * 0.5);
      if(hasTalent('bargain_hunter')) priceToPay = Math.ceil(priceToPay * 0.8);
      if(S.gold >= priceToPay){
        sfxBuy();
        S.gold -= priceToPay;
        shopBuffCrates.splice(i, 1);
        renderShop();
        render();
        showBuffSelect();
      }
    };

    cont.appendChild(d);
  });

  if(shopBuffCrates.length === 0){
    cont.innerHTML = '<div class="dim" style="padding:10px;font-size:11px">Sold out!</div>';
  }
}

function showBuffSelect(){
  // Pick up to 3 random buffs that the player doesn't already have.  Apply a weighted
  // distribution of 60% T1, 30% T2, 10% T3 when selecting each buff.  Do not allow
  // acquisition if the buff inventory (talent bar) is full.
  if(S.talents && S.talents.length >= BUFF_LIMIT){
    alert(`Your buff inventory is full (${BUFF_LIMIT} buffs). Remove or use a buff before acquiring more.`);
    return;
  }
  const availableBuffs = TALENTS.filter(t => !S.talents.includes(t.id));
  if(availableBuffs.length === 0){
    alert("No more buffs available!");
    return;
  }
  // Separate available buffs by tier for weighting
  const pool = {1:[],2:[],3:[]};
  availableBuffs.forEach(t => {
    pool[t.tier] = pool[t.tier] || [];
    pool[t.tier].push(t);
  });
  const choices = [];
  for(let i=0;i<3;i++){
    // Determine desired tier based on weighted random
    let tier = 1;
    const r = Math.random();
    if(r < 0.7){ tier = 1; }
    else if(r < 0.95){ tier = 2; }
    else { tier = 3; }
    // If no buffs in desired tier, fallback to next available tier (1->2->3)
    let pickPool = pool[tier] || [];
    if(pickPool.length === 0){
      // Flatten all remaining tiers into one list
      const remaining = [...(pool[1]||[]),...(pool[2]||[]),...(pool[3]||[])];
      if(remaining.length === 0) break;
      pickPool = remaining;
    }
    // Choose a random buff from the pool
    const idx = Math.floor(Math.random() * pickPool.length);
    const chosen = pickPool.splice(idx,1)[0];
    // Remove chosen from the overall pools to avoid duplicates
    [1,2,3].forEach(ti=>{
      const arr = pool[ti];
      const j = arr ? arr.indexOf(chosen) : -1;
      if(j >= 0) arr.splice(j,1);
    });
    choices.push(chosen);
    // If we've exhausted all available buffs, stop early
    if(Object.values(pool).every(arr => arr.length === 0)) break;
  }
  const container = $("#buff-choices");
  container.innerHTML = "";
  // Display horizontally rather than stacking vertically
  container.style.flexDirection = "row";
  container.style.justifyContent = "center";

  choices.forEach(buff => {
    const div = document.createElement("div");
    div.className = "talent-choice";
    div.style.cssText = "border:2px solid #666;padding:12px;border-radius:8px;cursor:pointer;transition:all 0.2s";

    // Tier colors
    const tierColors = {1: "#4d99ff", 2: "#9966cc", 3: "#ff6633"};
    const tierColor = tierColors[buff.tier] || "#666";

    div.title = buff.desc; // Add tooltip

    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:16px;font-weight:bold;color:${tierColor}">${buff.name}</div>
        <div style="font-size:11px;padding:2px 6px;background:${tierColor};color:#000;border-radius:4px">T${buff.tier}</div>
      </div>
      <div style="font-size:13px;line-height:1.4;color:#ccc">${buff.desc}</div>
    `;

    div.onmouseenter = () => {
      div.style.borderColor = tierColor;
      div.style.transform = "scale(1.02)";
    };
    div.onmouseleave = () => {
      div.style.borderColor = "#666";
      div.style.transform = "scale(1)";
    };

    div.onclick = () => {
      // Do not add beyond buff capacity
      if(S.talents.length >= BUFF_LIMIT){
        alert(`Your buff inventory is full (${BUFF_LIMIT} buffs). Remove or use a buff before acquiring more.`);
        return;
      }
      S.talents.push(buff.id);
      $("#buff-select-overlay").classList.remove("show");
      renderShop();
      render();
    };

    container.appendChild(div);
  });

  $("#buff-select-overlay").classList.add("show");
}

// Track multiple selected words for selling
let selectedSellWords = [];

function renderShopWordBank(){
  const cont = $("#shop-word-bank");
  cont.innerHTML = "";
  // Reset selection at the start of rendering
  selectedSellWords = [];
  document.getElementById("sell-word-btn").disabled = true;
  document.getElementById("sell-price-display").textContent = "";

  // Sort and filter inventory using the same logic as forge bank and apply ascending/descending order
  const sorted = getSortedVisibleBankWords(S.inv, S.shopSortMode, S.shopSortAsc);

  sorted.forEach((word) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    if(word.rarity === R.RUSTY) chip.classList.add("rusty");

    const rarityClass = RC[word.rarity] || RC[0];
    const tierText = RN[word.rarity] || "T1";

    // Add element display if word has an element
    let elemHtml = "";
    if(word.elem !== undefined){
      elemHtml = `<div class="chip-elem" style="color:${EC[word.elem]}">${EN[word.elem]}</div>`;
    }

    // Generate tooltip using the same function as forge
    const tooltip = mkTooltip(word);

    // Determine display name using the base (suffix) form for non‑weapons to match forge naming.
    const formsForChip = WORD_FORMS[word.id];
    let displayName = word.name;
    if(word.type !== 'weapon' && !word.isStick && formsForChip){
      displayName = formsForChip.suffix || word.name;
    }
    // Determine the info label: show only the tier for non‑weapons; for weapons, append the capitalised category.
    let infoLabel = tierText;
    if(word.type === 'weapon' && word.category){
      const cat = word.category;
      infoLabel += ` · ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
    }
    chip.innerHTML = `
      <div class="chip-name ${rarityClass}">${displayName}</div>
      <div class="chip-info">${infoLabel}</div>
      ${elemHtml}
      ${tooltip}
    `;

    chip.onclick = () => {
      // Toggle selection for this chip
      const idx = S.inv.indexOf(word);
      const existingIndex = selectedSellWords.findIndex(x => x.idx === idx);
      if(existingIndex >= 0){
        // Remove from selection
        selectedSellWords.splice(existingIndex, 1);
        chip.classList.remove("selected");
      } else {
        // Add to selection
        selectedSellWords.push({word, idx});
        chip.classList.add("selected");
      }
      // Recalculate total sell price
      let total = 0;
      selectedSellWords.forEach(({word}) => {
        const tier = RRANK[word.rarity] || 0;
        const sellPrice = tier === 0 ? 2 : tier === 2 ? 5 : 10;
        total += sellPrice;
      });
      if(total > 0){
        document.getElementById("sell-price-display").textContent = `Sell for ${total} gold`;
        document.getElementById("sell-word-btn").disabled = false;
      } else {
        document.getElementById("sell-price-display").textContent = "";
        document.getElementById("sell-word-btn").disabled = true;
      }
    };
    // Hover sfx for chips
    chip.onmouseenter = sfxHover;

    cont.appendChild(chip);
  });

  if(sorted.length === 0){
    cont.innerHTML = '<div class="dim" style="padding:10px;font-size:11px">No words in inventory</div>';
  }
}

function renderShopConsumables(){
  const cont=$("#shop-consumables");cont.innerHTML="";
  const shopHeader=document.createElement("div");
  shopHeader.className="dim";
  shopHeader.style.fontSize="11px";
  shopHeader.style.textAlign="center";
  shopHeader.style.marginBottom="6px";
  shopHeader.textContent="Shop Stock";
  cont.appendChild(shopHeader);

  shopConsumables.forEach((c,i)=>{
    const atLimit = S.consumables.length>=CONSUMABLE_LIMIT;
    const canAfford = S.gold>=c.cost;
    const d=document.createElement("div");d.className="shop-item";
    d.innerHTML=`
      <div class="chip-name rarity-magic">${c.name}</div>
      <div class="chip-info" style="font-size:9px;line-height:1.3;margin:4px 0">${c.desc}</div>
      <div class="shop-price gold">💰${c.cost}</div>
      <button class="shop-btn" ${(!canAfford||atLimit)?"disabled":""}>${atLimit?"Full" : "Buy"}</button>
    `;
    const btn=d.querySelector("button");
    btn.onmouseenter = sfxHover;
    btn.onclick=()=>{
      if(S.consumables.length>=CONSUMABLE_LIMIT){
        alert(`You can only carry ${CONSUMABLE_LIMIT} consumables.`);
        return;
      }
      if(S.gold>=c.cost){
        sfxBuy();
        S.gold-=c.cost;
        // Always add consumable to inventory for later use
        S.consumables.push(c.id);
        alert(`Purchased ${c.name}!`);
        shopConsumables.splice(i,1);
        renderShop();
        render();
      }
    };
    cont.appendChild(d);
  });
  if(shopConsumables.length===0){
    const soldOut=document.createElement("div");
    soldOut.className="dim";
    soldOut.style.padding="10px";
    soldOut.style.fontSize="11px";
    soldOut.textContent="Sold out!";
    cont.appendChild(soldOut);
  }

  const ownedHeader=document.createElement("div");
  ownedHeader.className="dim";
  ownedHeader.style.fontSize="11px";
  ownedHeader.style.textAlign="center";
  ownedHeader.style.margin="10px 0 6px";
  ownedHeader.textContent="Your Consumables";
  cont.appendChild(ownedHeader);

  if(!S.consumables.length){
    const none=document.createElement("div");
    none.className="dim";
    none.style.padding="10px";
    none.style.fontSize="11px";
    none.textContent="You have no consumables to sell.";
    cont.appendChild(none);
  } else {
    S.consumables.forEach((cid)=>{
      const cItem=CONSUMABLES.find(x=>x.id===cid);
      const sellPrice=Math.max(1, Math.floor((cItem?.cost||0)/2));
      const d=document.createElement("div");d.className="shop-item";
      d.innerHTML=`
        <div class="chip-name rarity-magic">${cItem?.name||cid}</div>
        <div class="chip-info" style="font-size:9px;line-height:1.3;margin:4px 0">${cItem?.desc||"Consumable"}</div>
        <div class="shop-price gold">Sell for 💰${sellPrice}</div>
        <button class="shop-btn">Sell</button>
      `;
      const btn=d.querySelector("button");
      btn.onmouseenter = sfxHover;
      btn.onclick=()=>{
        const idx=S.consumables.indexOf(cid);
        if(idx>=0){
          sfxRemove();
          S.consumables.splice(idx,1);
          S.gold+=sellPrice;
          alert(`Sold ${cItem?.name||cid} for ${sellPrice} gold.`);
          renderShop();
          render();
        }
      };
      cont.appendChild(d);
    });
  }
}

// Render active talents within the shop overlay.  Each talent is displayed as a chip with its
// name and rarity colour.  Clicking a talent will sell it for gold based on its tier or rarity.
function renderShopTalents(){
  const bar = document.getElementById('shop-talent-bar');
  if(!bar) return;
  bar.innerHTML = '';
  if(!S.talents || S.talents.length === 0){
    bar.innerHTML = '<div class="dim" style="font-size:10px;padding:4px">No active buffs</div>';
    return;
  }
  // Display current buff count versus capacity at the start of the bar
  const countDiv = document.createElement('div');
  countDiv.className = 'dim';
  countDiv.style.fontSize = '10px';
  countDiv.style.padding = '4px';
  countDiv.textContent = `${S.talents.length}/${BUFF_LIMIT}`;
  bar.appendChild(countDiv);
  S.talents.forEach((tid, idx) => {
    const t = TALENTS.find(x => x.id === tid);
    if(!t) return;
    const chip = document.createElement('div');
    chip.className = 'chip';
    // Determine rarity class using the existing RC mapping; fall back to Common if undefined
    const rarityClass = RC[t.rarity] || 'rarity-common';
    // Build tooltip for the talent using mkTooltip.  Talents behave similarly to words
    const tooltip = mkTooltip(t);
    chip.innerHTML = `<div class="chip-name ${rarityClass}">${t.name}</div><div class="chip-info">Buff</div>${tooltip}`;
    chip.style.cursor = 'default';
    chip.style.opacity = '0.9';
    // Buffs are not clickable/sellable - just display only
    bar.appendChild(chip);
  });
}

function rerollShop(){
  if(S.gold>=S.rerollCost){
    S.gold-=S.rerollCost;S.rerollCost=Math.min(S.rerollCost+5,50);
    rollShop();sfxClick();renderShop();render();
  }
}

function wPrice(w){
  let b=8;
  if(w.type==="weapon")b=12;
  else if(w.type==="adjective")b=Math.round((w.mult||1)*8);
  else if(w.type==="noun")b=Math.round((w.ap||4)*2.5);
  else if(w.type==="affinity")b=Math.round((w.mult||1.5)*6);
  return Math.max(5,Math.round(b*(w.rarity>=0?1+w.rarity*0.5:1)));
}

// === INVENTORY ===
function showInv(){
  const cont=$("#inv-list");cont.innerHTML="";
  $("#inv-count").textContent=`(${S.inv.length} words)`;
  const sorted=sortInventory(S.inv);
  sorted.forEach(w=>{
    const c=document.createElement("div");c.className="chip";c.style.cursor="default";
    // Use base (suffix) form for non‑weapons
    const formsForChip = WORD_FORMS[w.id];
    let displayName = w.name;
    if(w.type !== 'weapon' && !w.isStick && formsForChip){
      displayName = formsForChip.suffix || w.name;
    }
    // Determine info label: tier only for non‑weapons; tier + category for weapons
    const tierLabel = RN[w.rarity] || 'T1';
    let infoLabel = tierLabel;
    if(w.type === 'weapon' && w.category){
      const cat = w.category;
      infoLabel += ` · ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
    }
    let elemHtml=w.elem!==undefined?`<div class="chip-elem" style="color:${EC[w.elem]}">${EN[w.elem]}</div>`:"";
    c.innerHTML=`<div class="chip-name ${RC[w.rarity]}">${displayName}</div><div class="chip-info">${infoLabel}</div>${elemHtml}`;
    cont.appendChild(c);
  });
  $("#inv-overlay").classList.add("show");
}

// === UTILS ===
function clrSel(){S.sel={item:null,adj1:null,adj2:null,adj3:null,adj4:null,noun1:null}}
function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
function dly(ms){return new Promise(r=>setTimeout(r,ms))}
function anim(el,f,t,d,fmt=v=>Math.round(v)){return new Promise(res=>{const st=performance.now(),tick=n=>{const p=Math.min((n-st)/d,1);el.textContent=fmt(f+(t-f)*p);p<1?requestAnimationFrame(tick):res()};requestAnimationFrame(tick)})}
const isShopOpen=()=>document.getElementById('shop-overlay')?.classList.contains('show');
function openPauseMenu(context='run'){
  const pauseMenu=document.getElementById('pause-menu');
  const pauseContinue=$("#pause-continue");
  if(pauseContinue){
    pauseContinue.textContent=context==='shop'?"Return to Shop":"Return to Run";
  }
  if(pauseMenu){
    pauseMenu.dataset.context=context;
    pauseMenu.classList.add('show');
  }
}
function closePauseMenu(){
  const pauseMenu=document.getElementById('pause-menu');
  if(pauseMenu){
    pauseMenu.classList.remove('show');
    pauseMenu.removeAttribute('data-context');
  }
  const pauseContinue=$("#pause-continue");
  if(pauseContinue){
    pauseContinue.textContent="Return to Run";
  }
}

// Defer initialization until the DOM has fully loaded.  This ensures that
// elements like the main menu start button exist when we attach event
// handlers.  We also bind the start button here rather than in init() so
// that the menu behaves reliably across reloads.
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadRun();
  const mm = document.getElementById('main-menu');
  const startBtn = document.getElementById('start-game-btn');
  const contBtn = document.getElementById('continue-btn');
  const exitBtn = document.getElementById('exit-btn');
  const achBtn = document.getElementById('achievements-btn');
  updateContinueButtons();
  if(contBtn){
    contBtn.onclick = ()=>{if(mm)mm.classList.remove('show');render();};
  }
  if(startBtn){
    startBtn.onclick=()=>{if(mm)mm.classList.remove('show');startNewRun();};
    startBtn.onmouseenter=sfxHover;
  }
  if(exitBtn){exitBtn.onclick=()=>{if(mm)mm.classList.remove('show');};}
  if(achBtn){achBtn.onclick=()=>{document.getElementById('achievements-overlay').classList.add('show');renderStats();};}
  const pauseBtn=document.getElementById('pause-btn');
  if(pauseBtn){pauseBtn.onclick=()=>openPauseMenu(isShopOpen()?"shop":"run");}
  $("#pause-continue").onclick=()=>closePauseMenu();
  $("#pause-new").onclick=()=>{closePauseMenu();startNewRun();};
  $("#pause-achievements").onclick=()=>{closePauseMenu();document.getElementById('achievements-overlay').classList.add('show');renderStats();};
  $("#pause-exit").onclick=()=>closePauseMenu();
  const shopMenuBtn=document.getElementById('shop-menu');
  if(shopMenuBtn){shopMenuBtn.onclick=()=>openPauseMenu('shop');shopMenuBtn.onmouseenter=sfxHover;}
  const resetBtn=document.getElementById('stats-reset');
  if(resetBtn){
    resetBtn.onclick=()=>{
      PStats={attempts:0,victories:0,weaponsForged:0,bestDamage:0,heroClears:{},stackedCreations:0};
      saveStats();
      clearRunSave();
      renderStats();
    };
  }
  $("#achievements-close").onclick=()=>document.getElementById('achievements-overlay').classList.remove('show');
});

// Call init immediately to ensure the game initializes even if DOMContentLoaded has already fired.
// Without this call, the inventory and event handlers may not set up if this script loads after
// the DOM has already completed parsing.
init();
