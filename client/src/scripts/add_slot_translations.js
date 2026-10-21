import fs from 'fs';

const translations = {
  en: {
    "out of": "out of",
    "slots booked": "slots booked",
    "slots available": "slots available",
    "Predefined 1-hour slots • Max 10 patients per slot": "Predefined 1-hour slots • Max 10 patients per slot",
    "Checking slot capacity...": "Checking slot capacity...",
    "Morning Session": "Morning Session",
    "Afternoon Session": "Afternoon Session",
    "Evening Session": "Evening Session",
    "Lunch Break": "Lunch Break",
    "Evening Break": "Evening Break",
    "Slot Full": "Slot Full",
    "Open": "Open",
    "Full": "Full",
    "No Appointments": "No Appointments",
  },
  ta: {
    "out of": "ல்",
    "slots booked": "இடங்கள் முன்பதிவு செய்யப்பட்டுள்ளன",
    "slots available": "இடங்கள் உள்ளன",
    "Predefined 1-hour slots • Max 10 patients per slot": "1 மணி நேர இடைவெளி • ஒரு நேரத்திற்கு அதிகபட்சம் 10 நோயாளிகள்",
    "Checking slot capacity...": "நேர இடங்களின் எண்ணிக்கையைச் சரிபார்க்கிறது...",
    "Morning Session": "காலை அமர்வு",
    "Afternoon Session": "மதிய அமர்வு",
    "Evening Session": "மாலை அமர்வு",
    "Lunch Break": "மதிய உணவு இடைவேளை",
    "Evening Break": "மாலை இடைவேளை",
    "Slot Full": "இடம் நிரம்பியது",
    "Open": "கிடைக்கிறது",
    "Full": "நிரம்பியது",
    "No Appointments": "முன்பதிவு இல்லை",
  },
  te: {
    "out of": "లో",
    "slots booked": "స్లాట్లు బుక్ చేయబడ్డాయి",
    "slots available": "స్లాట్లు అందుబాటులో ఉన్నాయి",
    "Predefined 1-hour slots • Max 10 patients per slot": "1 గంట స్లాట్లు • స్లాట్‌కు గరిష్టంగా 10 మంది రోగులు",
    "Checking slot capacity...": "స్లాట్ లభ్యతను తనిఖీ చేస్తోంది...",
    "Morning Session": "ఉదయం సెషన్",
    "Afternoon Session": "మధ్యాహ్నం సెషన్",
    "Evening Session": "సాయంత్రం సెషన్",
    "Lunch Break": "లంచ్ విరామం",
    "Evening Break": "సాయంత్రం విరామం",
    "Slot Full": "స్లాట్ నిండింది",
    "Open": "అందుబాటులో ఉంది",
    "Full": "నిండింది",
    "No Appointments": "అపాయింట్‌మెంట్లు లేవు",
  },
  hi: {
    "out of": "में से",
    "slots booked": "स्लॉट बुक हो चुके हैं",
    "slots available": "स्लॉट उपलब्ध हैं",
    "Predefined 1-hour slots • Max 10 patients per slot": "1 घंटे के स्लॉट • प्रति स्लॉट अधिकतम 10 मरीज",
    "Checking slot capacity...": "स्लॉट क्षमता की जांच की जा रही है...",
    "Morning Session": "सुबह का सत्र",
    "Afternoon Session": "दोपहर का सत्र",
    "Evening Session": "शाम का सत्र",
    "Lunch Break": "दोपहर का भोजन अवकाश",
    "Evening Break": "शाम का अवकाश",
    "Slot Full": "स्लॉट भर चुका है",
    "Open": "उपलब्ध",
    "Full": "भरा हुआ",
    "No Appointments": "कोई अपॉइंटमेंट नहीं",
  },
};

for (const [lang, keys] of Object.entries(translations)) {
  const filePath = `client/src/translations/${lang}.js`;
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Format keys as JS object entries
  const entries = Object.entries(keys)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n');

  // Insert before final closing bracket
  const lastIndex = code.lastIndexOf('}');
  if (lastIndex !== -1) {
    code = code.slice(0, lastIndex) + entries + '\n};\n';
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated translations for ${lang}`);
  }
}
