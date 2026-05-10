const fs = require('fs');
const https = require('https');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'parts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const partsToFetch = [
  // BLADES
  { id: 'dran-sword', title: 'Blade_-_DranSword' },
  { id: 'hells-scythe', title: 'Blade_-_HellsScythe' },
  { id: 'knight-shield', title: 'Blade_-_KnightShield' },
  { id: 'cobalt-dragoon', title: 'Blade_-_CobaltDragoon' },
  { id: 'shark-scale', title: 'Blade_-_SharkScale' },
  { id: 'wizard-rod', title: 'Blade_-_WizardRod' },
  { id: 'wizard-arrow', title: 'Blade_-_WizardArrow' },
  { id: 'dran-buster-ux', title: 'Blade_-_DranBuster' },
  { id: 'hells-hammer-ux', title: 'Blade_-_HellsHammer' },
  { id: 'shark-edge', title: 'Blade_-_SharkEdge' },
  { id: 'phoenix-wing', title: 'Blade_-_PhoenixWing' },
  { id: 'leon-claw', title: 'Blade_-_LeonClaw' },
  { id: 'viper-tail', title: 'Blade_-_ViperTail' },
  { id: 'cobalt-drake', title: 'Blade_-_CobaltDrake' },
  { id: 'meteor-dragoon', title: 'Blade_-_MeteorDragoon' },
  { id: 'hover-wyvern', title: 'Blade_-_HoverWyvern' },
  { id: 'impact-drake', title: 'Blade_-_ImpactDrake' },
  { id: 'aero-pegasus', title: 'Blade_-_AeroPegasus' },
  { id: 'silver-wolf', title: 'Blade_-_SilverWolf' },
  { id: 'shinobi-shadow', title: 'Blade_-_ShinobiShadow' },
  { id: 'phoenix-rudder', title: 'Blade_-_PhoenixRudder' },
  { id: 'leon-crest', title: 'Blade_-_LeonCrest' },
  { id: 'knight-mail', title: 'Blade_-_KnightMail' },
  { id: 'samurai-saber', title: 'Blade_-_SamuraiSaber' },
  { id: 'tyranno-beat', title: 'Blade_-_TyrannoBeat' },
  { id: 'hells-chain', title: 'Blade_-_HellsChain' },
  { id: 'wyvern-gale', title: 'Blade_-_WyvernGale' },
  { id: 'unicorn-sting', title: 'Blade_-_UnicornSting' },
  { id: 'sphinx-cowl', title: 'Blade_-_SphinxCowl' },
  { id: 'ghost-circle', title: 'Blade_-_GhostCircle' },
  { id: 'golem-rock', title: 'Blade_-_GolemRock' },
  { id: 'scorpio-spear', title: 'Blade_-_ScorpioSpear' },
  { id: 'clock-mirage', title: 'Blade_-_ClockMirage' },
  { id: 'bullet-griffon', title: 'Blade_-_BulletGriffon' },
  { id: 'mummy-curse', title: 'Blade_-_MummyCurse' },
  // BITS
  { id: 'b-ball', title: 'Bit_-_Ball' },
  { id: 'b-rush', title: 'Bit_-_Rush' },
  { id: 'b-flat', title: 'Bit_-_Flat' },
  { id: 'b-low-rush', title: 'Bit_-_Low_Rush' },
  { id: 'b-hexa', title: 'Bit_-_Hexa' },
  { id: 'b-elevate', title: 'Bit_-_Elevate' },
  { id: 'b-level', title: 'Bit_-_Level' },
  { id: 'b-kick', title: 'Bit_-_Kick' },
  { id: 'b-glide', title: 'Bit_-_Glide' },
  { id: 'b-free-ball', title: 'Bit_-_Free_Ball' },
  { id: 'b-needle', title: 'Bit_-_Needle' },
  { id: 'b-taper', title: 'Bit_-_Taper' },
  { id: 'b-spike', title: 'Bit_-_Spike' },
  { id: 'b-point', title: 'Bit_-_Point' },
  { id: 'b-accel', title: 'Bit_-_Accel' },
  { id: 'b-unite', title: 'Bit_-_Unite' },
  { id: 'b-metal-needle', title: 'Bit_-_Metal_Needle' },
  { id: 'b-rubber-accel', title: 'Bit_-_Rubber_Accel' },
  { id: 'b-gear-flat', title: 'Bit_-_Gear_Flat' },
  { id: 'b-high-taper', title: 'Bit_-_High_Taper' },
  { id: 'b-bound-spike', title: 'Bit_-_Bound_Spike' },
  { id: 'b-dot', title: 'Bit_-_Dot' },
  { id: 'b-orb', title: 'Bit_-_Orb' },
  { id: 'b-wedge', title: 'Bit_-_Wedge' },
  { id: 'b-trans-kick', title: 'Bit_-_Trans_Kick' },
  { id: 'b-gear-rush', title: 'Bit_-_Gear_Rush' },
  { id: 'b-gear-ball', title: 'Bit_-_Gear_Ball' },
  { id: 'b-disc-ball', title: 'Bit_-_Disc_Ball' },
  { id: 'b-low-flat', title: 'Bit_-_Low_Flat' },
  { id: 'b-gear-needle', title: 'Bit_-_Gear_Needle' },
  { id: 'b-gear-point', title: 'Bit_-_Gear_Point' },
  { id: 'b-cyclone', title: 'Bit_-_Cyclone' },
  { id: 'b-jolt', title: 'Bit_-_Jolt' },
  { id: 'b-quake', title: 'Bit_-_Quake' },
  { id: 'b-zap', title: 'Bit_-_Zap' },
  // RATCHETS
  { id: 'r-3-60', title: 'Ratchet_-_3-60' },
  { id: 'r-4-60', title: 'Ratchet_-_4-60' },
  { id: 'r-1-60', title: 'Ratchet_-_1-60' },
  { id: 'r-9-60', title: 'Ratchet_-_9-60' },
  { id: 'r-5-60', title: 'Ratchet_-_5-60' },
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(dest))
           .on('error', reject)
           .once('close', () => resolve());
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      } else {
        res.resume();
        reject(new Error(`Request Failed With Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

function fetchApi(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function scrapePart(part) {
  const file = path.join(outDir, `${part.id}.png`);
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) {
    console.log(`[SKIP] ${part.id} (exists)`);
    return;
  }
  
  const apiUrl = `https://beyblade.fandom.com/api.php?action=query&titles=${encodeURIComponent(part.title)}&prop=pageimages&format=json&pithumbsize=500`;
  
  try {
    const data = await fetchApi(apiUrl);
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1' || !pages[pageId].thumbnail) {
      console.log(`[FAIL] ${part.id} - no image found in API`);
      return;
    }
    
    let imgUrl = pages[pageId].thumbnail.source;
    // Strip revision parameters to get original image if we want, but 500px thumb is fine
    imgUrl = imgUrl.split('/revision/')[0]; 
    
    await downloadImage(imgUrl, file);
    console.log(`[OK] ${part.id}`);
  } catch(e) {
    console.log(`[FAIL] ${part.id} - ${e.message}`);
  }
}

async function run() {
  for (let i = 0; i < partsToFetch.length; i += 5) {
    const chunk = partsToFetch.slice(i, i + 5);
    await Promise.all(chunk.map(scrapePart));
  }
  console.log('All done!');
}

run();
