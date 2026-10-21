import fs from 'fs';

const seedPath = 'd:/FSD Project/server/src/seed/seed.js';
let content = fs.readFileSync(seedPath, 'utf8');

const USER_PROVIDED_PHOTOS = {
  "Prof. Dr. P. V. A. Mohandas": "/doctors/doctor_pva_mohandas.jpg",
  "Dr. Rajan Ravichandran": "/doctors/doctor_rajan_ravichandran.png",
  "Dr. Surendran Rajagopal": "/doctors/doctor_surendran_rajagopal.png",
  "Dr. A. Murali": "/doctors/doctor_a_murali.png",
  "Dr. Sundararajan Sridhar": "/doctors/doctor_sundararajan_sridhar.png",
  "Dr. S. Palaniappan": "/doctors/doctor_s_palaniappan.png",
};

for (const [name, url] of Object.entries(USER_PROVIDED_PHOTOS)) {
  const escName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reg = new RegExp(`(name:\\s*"${escName}"[\\s\\S]*?avatar:\\s*)"[^"]+"`, 'g');
  content = content.replace(reg, `$1"${url}"`);
}

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Updated seed.js with official user photos!');
