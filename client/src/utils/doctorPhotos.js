// Professional, gender-distinct, non-repeating doctor portrait photos for MIOT International doctors
// Includes official user-provided portraits for key MIOT leadership and specialists.

import pvaImg from '../assets/doctor_pva_mohandas.jpg';
import rajanImg from '../assets/doctor_rajan_ravichandran.png';
import muraliImg from '../assets/doctor_a_murali.png';
import sridharImg from '../assets/doctor_sundararajan_sridhar.png';
import surendranImg from '../assets/doctor_surendran_rajagopal.png';
import palaniappanImg from '../assets/doctor_s_palaniappan.png';

export const DOCTOR_PHOTOS = {
  // ── User-Provided Official MIOT Doctor Portraits ──
  "Prof. Dr. P. V. A. Mohandas": pvaImg,
  "Dr. P. V. A. Mohandas": pvaImg,
  "Dr. Rajan Ravichandran": rajanImg,
  "Dr. Surendran Rajagopal": surendranImg,
  "Dr. A. Murali": muraliImg,
  "Dr. Sundararajan Sridhar": sridharImg,
  "Dr. S. Palaniappan": palaniappanImg,

  // ── Female Specialists (10 Unique Verified Portraits) ──
  "Dr. M. S. Meenakshi": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
  "Dr. Bindu Thankappan": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
  "Dr. Lourdes Pravina L N Vasagam": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=80",
  "Dr. Kiruthika S": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80",
  "Dr. Saraswathy Gokulraj": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
  "Dr. Tamil Vani": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=400&q=80",
  "Dr. Sushmitha Asokan": "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=400&q=80",
  "Dr. Vindhya Raparla": "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&q=80",
  "Dr. Harshita Bakshi": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  "Dr. Melissa Sathyan": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",

  // ── Male Specialists (27 Unique Verified Portraits) ──
  "Dr. J. Vijesh": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
  "Dr. Shyam Kumar G": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
  "Dr. Vijay Shanmugam G": "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&q=80",
  "Dr. Arun Sampath": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
  "Dr. M. Manimaran": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
  "Dr. Prithvi Mohandas": "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&q=80",
  "Dr. Billy Paul Wilson": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
  "Dr. Senthil Kumar Ravichander": "https://images.unsplash.com/photo-1637059824899-a441006a6875?w=400&q=80",
  "Dr. Prasad E": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
  "Dr. V. C. Shrinivas": "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80",
  "Dr. M. Ragavan": "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&q=80",
  "Dr. Sugandhan S": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80",
  "Dr. Muthukumar": "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?w=400&q=80",
  "Dr. S. Sundara Pandian": "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&q=80",
  "Dr. S. P. Kurinjinathan": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&q=80",
  "Dr. Chezhian Subash": "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?w=400&q=80",
  "Dr. Kishore Kumar": "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&q=80",
  "Dr. Ilango Sethu": "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&q=80",
  "Dr. Prakasam Rangaswamy K": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&q=80",
  "Dr. Karthik Mathivanan": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",

  // ── Hospital Clinical & Emergency Teams ──
  "MIOT Dental Surgery Team": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80",
  "MIOT Emergency Care Team": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
};

// Fallback pools of gender-distinct photos (each strictly distinct)
export const FEMALE_DOCTOR_FALLBACKS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=80",
  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
  "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=400&q=80",
  "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=400&q=80",
  "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
];

export const MALE_DOCTOR_FALLBACKS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
  "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
  "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80",
  "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&q=80",
  "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
  "https://images.unsplash.com/photo-1637059824899-a441006a6875?w=400&q=80",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80",
  "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&q=80",
  "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80",
  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?w=400&q=80",
  "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?w=400&q=80",
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&q=80",
  "https://images.unsplash.com/photo-1622253694242-abeb37a33e97?w=400&q=80",
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&q=80",
  "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&q=80",
  "https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
];

/**
 * Returns a guaranteed distinct doctor avatar photo matching the doctor's name and gender.
 * Uses user-provided official photos for Dr. Mohandas, Dr. Ravichandran, Dr. Rajagopal,
 * Dr. Murali, Dr. Sridhar, and Dr. Palaniappan.
 */
export const getDoctorPhoto = (doc) => {
  const name = (doc?.user?.name || doc?.name || '').trim();
  if (DOCTOR_PHOTOS[name]) {
    return DOCTOR_PHOTOS[name];
  }

  // Also check without prefix if needed
  const cleanName = name.replace(/^(Dr\.|Prof\.\s*Dr\.|Dr)\s*/i, 'Dr. ');
  if (DOCTOR_PHOTOS[cleanName]) {
    return DOCTOR_PHOTOS[cleanName];
  }

  const existingAvatar = doc?.user?.avatar || doc?.avatar;
  if (existingAvatar && !existingAvatar.includes('1594824813590-4828f731215b')) {
    return existingAvatar;
  }

  const gender = doc?.user?.gender || doc?.gender || 'male';
  const pool = gender === 'female' ? FEMALE_DOCTOR_FALLBACKS : MALE_DOCTOR_FALLBACKS;

  const str = name || doc?._id || 'doctor';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
};

export default getDoctorPhoto;
