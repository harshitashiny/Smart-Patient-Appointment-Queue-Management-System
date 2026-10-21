import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Department from '../models/Department.js';
import Hospital from '../models/Hospital.js';

dotenv.config({ path: '../.env' });

// 20 Standard Medical Departments matching MIOT International Directory
const departmentsData = [
  { name: 'Cardiology', description: 'Comprehensive heart and cardiovascular care', icon: 'Heart' },
  { name: 'Neurology', description: 'Brain, spine, and neurological disorders', icon: 'Brain' },
  { name: 'Pulmonology', description: 'Lungs, respiration, and chest health', icon: 'Lungs' },
  { name: 'General Medicine', description: 'Primary healthcare, internal medicine, and wellness', icon: 'Stethoscope' },
  { name: 'Orthopedics', description: 'Bones, joints, spine, and musculoskeletal surgery', icon: 'Bone' },
  { name: 'Oncology', description: 'Advanced cancer screening, chemo, and surgical care', icon: 'ShieldAlert' },
  { name: 'Pediatrics', description: 'Newborn, infant, and child medical care', icon: 'Baby' },
  { name: 'Obstetrics & Gynecology', description: 'Women health, maternity, and prenatal care', icon: 'Sparkles' },
  { name: 'Dermatology', description: 'Skin, hair, nails, and aesthetic dermatology', icon: 'Sun' },
  { name: 'Ophthalmology', description: 'Complete eye care, retina, cornea, and vision surgery', icon: 'Eye' },
  { name: 'ENT', description: 'Ear, Nose, Throat, and head-neck surgical care', icon: 'Ear' },
  { name: 'Psychiatry', description: 'Mental wellness, counseling, and behavioral therapies', icon: 'Smile' },
  { name: 'Dentistry', description: 'Dental surgeries, cosmetic smiles, and orthodontics', icon: 'Activity' },
  { name: 'Nephrology', description: 'Kidney disorders, dialysis, and renal health', icon: 'Filter' },
  { name: 'Hematology', description: 'Blood disorders, anemia, and bone marrow health', icon: 'Droplets' },
  { name: 'Endocrinology', description: 'Diabetes, thyroid, and hormone care', icon: 'Zap' },
  { name: 'Infectious Diseases', description: 'Viral, bacterial, tropical, and contagious illnesses', icon: 'ShieldCheck' },
  { name: 'Gastroenterology', description: 'Digestive system, liver, endoscopy, and stomach care', icon: 'Compass' },
  { name: 'Emergency Medicine', description: '24/7 Critical care, trauma, and acute emergency response', icon: 'AlertTriangle' },
  { name: 'General Surgery', description: 'Advanced laparoscopic, trauma, and general surgical care', icon: 'Scissors' },
];

// MIOT International - Single Hospital for Online Appointments
const hospitalData = [
  {
    name: 'MIOT International',
    address: '4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Multi-Specialty Quaternary Care Hospital',
    location: { lat: 13.0205, lon: 80.1783 },
    phone: '+91 44 42002288',
    emergencyAvailable: true,
    openHours: '24/7 Open',
    rating: 4.9,
    totalReviews: 1250,
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    departments: [
      'Cardiology', 'Neurology', 'Pulmonology', 'General Medicine', 'Orthopedics',
      'Oncology', 'Pediatrics', 'Obstetrics & Gynecology', 'Dermatology', 'Ophthalmology',
      'ENT', 'Psychiatry', 'Dentistry', 'Nephrology', 'Hematology',
      'Endocrinology', 'Infectious Diseases', 'Gastroenterology', 'Emergency Medicine', 'General Surgery'
    ],
    availableBeds: 1000,
    establishedYear: 1999,
  },
];

// MIOT INTERNATIONAL HOSPITAL — DOCTOR DIRECTORY (From Official PDF Data)
const doctorData = [
  // ── 1. Cardiology ──
  {
    name: "Dr. M. S. Meenakshi",
    specialization: "Cardiology",
    qualification: "MBBS; MD (Pediatrics); DM (Cardiology)",
    designation: "Consultant / Interventional Cardiologist",
    expertise: "Simple & complex coronary angioplasty; peripheral angioplasty; intravascular imaging; pacemakers; structural heart interventions",
    experience: 25,
    experienceDisplay: "25+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam / MIOT-related profile",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 900,
    rating: "4.9",
    totalRatings: 185,
    totalPatients: 1420,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    bio: "Dr. M. S. Meenakshi is a Consultant / Interventional Cardiologist at MIOT International with over 25 years of experience. Her expertise encompasses simple and complex coronary angioplasty, peripheral angioplasty, intravascular imaging, pacemakers, and structural heart interventions."
  },
  {
    name: "Dr. J. Vijesh",
    specialization: "Cardiology",
    qualification: "MBBS; MD; DM (Cardiology)",
    designation: "Consultant / Interventional Cardiologist",
    expertise: "Complex coronary interventions; peripheral, renal & carotid angioplasty; balloon mitral valvotomy",
    experience: 13,
    experienceDisplay: "13+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam / MIOT-related profile",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 850,
    rating: "4.8",
    totalRatings: 142,
    totalPatients: 980,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    bio: "Dr. J. Vijesh is a Consultant / Interventional Cardiologist at MIOT International with over 13 years of expertise in complex coronary interventions, peripheral, renal and carotid angioplasty, and balloon mitral valvotomy."
  },
  {
    name: "Dr. Shyam Kumar G",
    specialization: "Cardiology",
    qualification: "MBBS; MD; DM (Cardiology)",
    designation: "Consultant / Interventional Cardiologist",
    expertise: "Primary/elective angioplasty; balloon mitral valvuloplasty; pacemakers; ICD implantation; electrophysiology",
    experience: 13,
    experienceDisplay: "13+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam / MIOT-related profile",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 850,
    rating: "4.8",
    totalRatings: 120,
    totalPatients: 860,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
    bio: "Dr. Shyam Kumar G is a Consultant / Interventional Cardiologist at MIOT International with over 13 years of experience specializing in primary/elective angioplasty, balloon mitral valvuloplasty, pacemakers, ICD implantation, and electrophysiology."
  },

  // ── 2. Neurology ──
  {
    name: "Dr. Bindu Thankappan",
    specialization: "Neurology",
    qualification: "Not publicly stated in source checked",
    designation: "Senior Consultant - Neurology",
    expertise: "Neurology",
    experience: 20,
    experienceDisplay: "20 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 900,
    rating: "4.9",
    totalRatings: 168,
    totalPatients: 1150,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    bio: "Dr. Bindu Thankappan is a Senior Consultant Neurologist at MIOT International with 20 years of clinical practice providing specialized neurological care, diagnosis, and management."
  },
  {
    name: "Dr. Lourdes Pravina L N Vasagam",
    specialization: "Neurology",
    qualification: "Not publicly stated in source checked",
    designation: "Neurologist",
    expertise: "Neurology",
    experience: 12,
    experienceDisplay: "12 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 800,
    rating: "4.7",
    totalRatings: 95,
    totalPatients: 740,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=80",
    bio: "Dr. Lourdes Pravina L N Vasagam is a Neurologist at MIOT International with 12 years of clinical neurology experience, dedicated to comprehensive neuro care."
  },
  {
    name: "Dr. Vijay Shanmugam G",
    specialization: "Neurology",
    qualification: "Not publicly stated in source checked",
    designation: "Neurologist",
    expertise: "Neurology",
    experience: 10,
    experienceDisplay: "Experience not stated in source checked",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 750,
    rating: "4.6",
    totalRatings: 82,
    totalPatients: 560,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&q=80",
    bio: "Dr. Vijay Shanmugam G is a Neurologist at MIOT International offering specialized diagnosis and therapeutic management for complex neurological disorders."
  },

  // ── 3. Pulmonology ──
  {
    name: "Dr. Arun Sampath",
    specialization: "Pulmonology",
    qualification: "MBBS; MD; DNB",
    designation: "Consultant - Pulmonology",
    expertise: "PFT; bronchoscopy; decortication; pneumonectomy; mediastinoscopy; lobectomy; tracheostomy",
    experience: 21,
    experienceDisplay: "21+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MediJourney",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 850,
    rating: "4.9",
    totalRatings: 174,
    totalPatients: 1320,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
    bio: "Dr. Arun Sampath is a Consultant Pulmonologist at MIOT International with over 21 years of experience in pulmonary medicine, PFT, bronchoscopy, decortication, pneumonectomy, mediastinoscopy, and lobectomy."
  },
  {
    name: "Dr. M. Manimaran",
    specialization: "Pulmonology",
    qualification: "MBBS; DNB; DTCD",
    designation: "Consultant - Pulmonology",
    expertise: "Interventional pulmonary procedures; tracheostomy; lung transplant; PFT; decortication",
    experience: 23,
    experienceDisplay: "23+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MediJourney",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 900,
    rating: "4.8",
    totalRatings: 160,
    totalPatients: 1240,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    bio: "Dr. M. Manimaran is a Consultant Pulmonologist at MIOT International with over 23 years of experience. He specializes in interventional pulmonary procedures, tracheostomy, lung transplant assessment, and decortication."
  },

  // ── 4. General Medicine ──
  {
    name: "Dr. S. Palaniappan",
    specialization: "General Medicine",
    qualification: "MBBS; MD (General Medicine); DM (Gastroenterology)",
    designation: "Consultant",
    expertise: "Internal Medicine / Gastroenterology",
    experience: 36,
    experienceDisplay: "36 years overall",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Practo",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 800,
    rating: "4.9",
    totalRatings: 310,
    totalPatients: 2450,
    gender: "male",
    avatar: "/doctors/doctor_s_palaniappan.png",
    bio: "Dr. S. Palaniappan is a Consultant at MIOT International with 36 years of comprehensive clinical practice in Internal Medicine and Gastroenterology, providing primary and quaternary care."
  },

  // ── 5. Orthopedics ──
  {
    name: "Prof. Dr. P. V. A. Mohandas",
    specialization: "Orthopedics",
    qualification: "MBBS; MS Orth.; M.Ch Orth. (Liverpool); D.Orth.; D.Sc. (Hon.)",
    designation: "Founder & Mentor; Chief Surgeon - Orthopaedic Surgery",
    expertise: "Joint replacement; hip/knee replacement; spine surgery; orthopaedic trauma",
    experience: 45,
    experienceDisplay: "Long-standing experience; exact years not stated by MIOT",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1500,
    rating: "5.0",
    totalRatings: 480,
    totalPatients: 3800,
    gender: "male",
    avatar: "/doctors/doctor_pva_mohandas.jpg",
    bio: "Prof. Dr. P. V. A. Mohandas is the Founder, Mentor, and Chief Surgeon of Orthopaedic Surgery at MIOT International. Renowned worldwide for joint replacement, hip and knee reconstructive surgeries, and spine surgery."
  },
  {
    name: "Dr. Prithvi Mohandas",
    specialization: "Orthopedics",
    qualification: "Qualification not fully stated in source checked",
    designation: "Director - Orthopaedics",
    expertise: "Orthopaedic & joint replacement surgery",
    experience: 21,
    experienceDisplay: "21+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1200,
    rating: "4.9",
    totalRatings: 320,
    totalPatients: 2100,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&q=80",
    bio: "Dr. Prithvi Mohandas is the Director of Orthopaedics at MIOT International with over 21 years of surgical leadership in orthopaedic and primary and revision joint replacement surgery."
  },
  {
    name: "Dr. Billy Paul Wilson",
    specialization: "Orthopedics",
    qualification: "MBBS; MS; MRCS",
    designation: "Orthopaedic & Joint Replacement Surgeon",
    expertise: "Knee surgery; sports injury; minimally invasive knee correction; reconstruction & rehabilitation",
    experience: 27,
    experienceDisplay: "27 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "HealthInde",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1000,
    rating: "4.8",
    totalRatings: 210,
    totalPatients: 1650,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    bio: "Dr. Billy Paul Wilson is an Orthopaedic & Joint Replacement Surgeon at MIOT International with 27 years of expertise in knee surgeries, sports injuries, minimally invasive corrections, and joint rehabilitation."
  },

  // ── 6. Oncology ──
  {
    name: "Dr. Senthil Kumar Ravichander",
    specialization: "Oncology",
    qualification: "MBBS; MS; M.Ch",
    designation: "Senior Consultant - Surgical Oncology",
    expertise: "Gastrointestinal, breast, gynaecologic, head & neck cancers; minimally invasive oncology",
    experience: 20,
    experienceDisplay: "20+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MediJourney",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1100,
    rating: "4.9",
    totalRatings: 195,
    totalPatients: 1380,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1637059824899-a441006a6875?w=400&q=80",
    bio: "Dr. Senthil Kumar Ravichander is a Senior Consultant Surgical Oncologist at MIOT International with over 20 years of experience in gastrointestinal, breast, gynaecologic, head & neck cancers, and minimally invasive oncology."
  },
  {
    name: "Dr. Prasad E",
    specialization: "Oncology",
    qualification: "Not fully stated in source checked",
    designation: "Consultant - Medical Oncology",
    expertise: "Head & neck tumour; lung cancer; giant cell tumour; cancer surgery; PICC line insertion",
    experience: 20,
    experienceDisplay: "20+ years listed; profile says >15 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1000,
    rating: "4.8",
    totalRatings: 160,
    totalPatients: 1120,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
    bio: "Dr. Prasad E is a Consultant in Medical Oncology at MIOT International with over 15-20 years of experience managing head & neck tumours, lung cancers, giant cell tumours, and chemotherapy administration."
  },

  // ── 7. Pediatrics ──
  {
    name: "Dr. V. C. Shrinivas",
    specialization: "Pediatrics",
    qualification: "MBBS; MD (Pediatrics)",
    designation: "Consultant / Head of Department - General Paediatrics",
    expertise: "General paediatrics; respiratory problems; allergies; infections; congenital defects; hormonal disorders",
    experience: 22,
    experienceDisplay: "22+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam / Practo",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 750,
    rating: "4.9",
    totalRatings: 280,
    totalPatients: 2150,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80",
    bio: "Dr. V. C. Shrinivas is Consultant and Head of Department of General Paediatrics at MIOT International with 22+ years of clinical excellence in general paediatrics, childhood allergies, and infections."
  },
  {
    name: "Dr. Kiruthika S",
    specialization: "Pediatrics",
    qualification: "Not publicly stated in source checked",
    designation: "Pediatrician",
    expertise: "General Pediatrics",
    experience: 12,
    experienceDisplay: "12 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 650,
    rating: "4.7",
    totalRatings: 110,
    totalPatients: 890,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80",
    bio: "Dr. Kiruthika S is a Pediatrician at MIOT International with 12 years of clinical experience providing dedicated medical care for infants, children, and adolescents."
  },
  {
    name: "Dr. M. Ragavan",
    specialization: "Pediatrics",
    qualification: "MBBS; MS; M.Ch; DNB; MNAMS; MRCS",
    designation: "HOD / Pediatric Surgeon",
    expertise: "Advanced laparoscopic & minimally invasive pediatric surgery; pediatric surgical conditions",
    experience: 24,
    experienceDisplay: "24+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MediJourney / Vaidam",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 950,
    rating: "4.9",
    totalRatings: 175,
    totalPatients: 1400,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&q=80",
    bio: "Dr. M. Ragavan is HOD and Pediatric Surgeon at MIOT International with 24+ years of specialized surgical practice in advanced laparoscopic and minimally invasive pediatric surgical corrections."
  },

  // ── 8. Obstetrics & Gynecology ──
  {
    name: "Dr. Saraswathy Gokulraj",
    specialization: "Obstetrics & Gynecology",
    qualification: "MBBS; DGO; fellowship information published by Vaidam",
    designation: "HOD / Gynaecologist & Obstetrician",
    expertise: "Uterine/ovarian cysts; fibroids; menstrual disorders; endometriosis; hormonal disorders; laparoscopic procedures",
    experience: 33,
    experienceDisplay: "33+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 950,
    rating: "4.9",
    totalRatings: 260,
    totalPatients: 2300,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
    bio: "Dr. Saraswathy Gokulraj is HOD / Gynaecologist & Obstetrician at MIOT International with over 33 years of experience in uterine/ovarian cysts, fibroids, menstrual disorders, endometriosis, and laparoscopic gynecology."
  },
  {
    name: "Dr. Tamil Vani",
    specialization: "Obstetrics & Gynecology",
    qualification: "Qualification not fully stated in source checked",
    designation: "Senior Consultant - Gynaecology & Obstetrics",
    expertise: "Gynaecology & Obstetrics",
    experience: 18,
    experienceDisplay: "18+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 800,
    rating: "4.8",
    totalRatings: 145,
    totalPatients: 1100,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=400&q=80",
    bio: "Dr. Tamil Vani is a Senior Consultant in Gynaecology & Obstetrics at MIOT International with 18+ years of dedicated practice in maternal health and comprehensive women's healthcare."
  },

  // ── 9. Dermatology ──
  {
    name: "Dr. Sugandhan S",
    specialization: "Dermatology",
    qualification: "Not publicly stated in source checked",
    designation: "Dermatologist",
    expertise: "Dermatology",
    experience: 30,
    experienceDisplay: "30 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 750,
    rating: "4.8",
    totalRatings: 190,
    totalPatients: 1850,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80",
    bio: "Dr. Sugandhan S is a Dermatologist at MIOT International with 30 years of clinical experience addressing chronic skin conditions, dermatological therapies, and aesthetic care."
  },
  {
    name: "Dr. Sushmitha Asokan",
    specialization: "Dermatology",
    qualification: "Not publicly stated in source checked",
    designation: "Dermatologist",
    expertise: "Dermatology",
    experience: 10,
    experienceDisplay: "10 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 700,
    rating: "4.7",
    totalRatings: 88,
    totalPatients: 640,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=400&q=80",
    bio: "Dr. Sushmitha Asokan is a Dermatologist at MIOT International with 10 years of practice providing clinical skin disease care and modern aesthetic dermatological treatments."
  },
  {
    name: "Dr. Vindhya Raparla",
    specialization: "Dermatology",
    qualification: "Not publicly stated in source checked",
    designation: "Dermatologist",
    expertise: "Dermatology",
    experience: 10,
    experienceDisplay: "10 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 700,
    rating: "4.7",
    totalRatings: 82,
    totalPatients: 610,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&q=80",
    bio: "Dr. Vindhya Raparla is a Dermatologist at MIOT International with 10 years of dedicated practice focusing on medical dermatology, skin rejuvenation, and hair/nail care."
  },

  // ── 10. Ophthalmology ──
  {
    name: "Dr. Harshita Bakshi",
    specialization: "Ophthalmology",
    qualification: "Not fully stated in source checked",
    designation: "Senior Consultant - Ophthalmology",
    expertise: "Refraction; muscle balance; slit-lamp examination; tonometry; retinal evaluation",
    experience: 30,
    experienceDisplay: "34+ years listed; profile states 30 years overall",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 850,
    rating: "4.9",
    totalRatings: 240,
    totalPatients: 1980,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    bio: "Dr. Harshita Bakshi is a Senior Consultant Ophthalmologist at MIOT International with over 30 years of clinical experience in refraction, muscle balance, slit-lamp examination, tonometry, and retinal evaluation."
  },

  // ── 11. ENT ──
  {
    name: "Dr. Muthukumar",
    specialization: "ENT",
    qualification: "Not publicly stated in source checked",
    designation: "ENT Specialist",
    expertise: "ENT / Head & Neck & Skull-base Surgery",
    experience: 35,
    experienceDisplay: "35 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 800,
    rating: "4.9",
    totalRatings: 260,
    totalPatients: 2100,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?w=400&q=80",
    bio: "Dr. Muthukumar is an ENT Specialist at MIOT International with 35 years of clinical and surgical expertise in ear, nose, throat, head & neck, and skull-base surgeries."
  },
  {
    name: "Dr. S. Sundara Pandian",
    specialization: "ENT",
    qualification: "Not publicly stated in source checked",
    designation: "ENT Specialist",
    expertise: "ENT / Head & Neck & Skull-base Surgery",
    experience: 16,
    experienceDisplay: "16 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 750,
    rating: "4.7",
    totalRatings: 130,
    totalPatients: 980,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&q=80",
    bio: "Dr. S. Sundara Pandian is an ENT Specialist at MIOT International with 16 years of experience in microscopic and endoscopic ENT, sinus, head & neck, and skull-base surgery."
  },

  // ── 12. Psychiatry ──
  {
    name: "Dr. S. P. Kurinjinathan",
    specialization: "Psychiatry",
    qualification: "MBBS; DPM; MRCPsych; MSc - Psychiatric Research",
    designation: "Head - Mental Well-being",
    expertise: "Child & adolescent; forensic; adult; geriatric psychiatry; CBT",
    experience: 22,
    experienceDisplay: "22+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 900,
    rating: "4.9",
    totalRatings: 195,
    totalPatients: 1450,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&q=80",
    bio: "Dr. S. P. Kurinjinathan is Head of Mental Well-being at MIOT International with over 22 years of experience covering child & adolescent, forensic, adult, geriatric psychiatry, and cognitive behavioral therapy (CBT)."
  },

  // ── 13. Dentistry ──
  {
    name: "MIOT Dental Surgery Team",
    specialization: "Dentistry",
    qualification: "BDS; MDS (Oral & Maxillofacial Surgery)",
    designation: "Dental Surgery / Oral & Maxillofacial Surgery",
    expertise: "Dental surgery; orthodontics; periodontics; cosmetic/aesthetic dentistry; oral & maxillofacial surgery",
    experience: 15,
    experienceDisplay: "Not publicly stated",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official specialty listing",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 600,
    rating: "4.8",
    totalRatings: 210,
    totalPatients: 1780,
    gender: "other",
    avatar: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80",
    bio: "The MIOT Dental Surgery and Oral & Maxillofacial Surgery team provides advanced restorative dentistry, smile aesthetics, periodontics, orthodontics, and complete maxillofacial surgical care."
  },

  // ── 14. Nephrology ──
  {
    name: "Dr. Rajan Ravichandran",
    specialization: "Nephrology",
    qualification: "MBBS; MD Internal Medicine; Diplomate in Nephrology, National Board",
    designation: "Head - MIOT Institute of Nephrology",
    expertise: "General nephrology; dialysis; kidney transplantation",
    experience: 30,
    experienceDisplay: "30+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1100,
    rating: "5.0",
    totalRatings: 380,
    totalPatients: 2900,
    gender: "male",
    avatar: "/doctors/doctor_rajan_ravichandran.png",
    bio: "Dr. Rajan Ravichandran is Head of the MIOT Institute of Nephrology with over 30 years of pioneering experience in general nephrology, dialysis management, and kidney transplantation."
  },

  // ── 15. Hematology ──
  {
    name: "Dr. Chezhian Subash",
    specialization: "Hematology",
    qualification: "MBBS; MRCP; FRC (Pathology)",
    designation: "HOD - Haematology, Haemato-Oncology & Bone Marrow Transplant",
    expertise: "General/laboratory haematology; haemato-pathology; transfusion medicine; haemato-oncology; BMT",
    experience: 25,
    experienceDisplay: "Extensive experience; exact years not stated by MIOT",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1200,
    rating: "4.9",
    totalRatings: 220,
    totalPatients: 1600,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?w=400&q=80",
    bio: "Dr. Chezhian Subash is HOD of Haematology, Haemato-Oncology & Bone Marrow Transplant at MIOT International, with extensive expertise in general haematology, transfusion medicine, and BMT."
  },
  {
    name: "Dr. Kishore Kumar",
    specialization: "Hematology",
    qualification: "MBBS; MD; DM Clinical Haematology (PGIMER)",
    designation: "Consultant - Haematology Oncology",
    expertise: "Haematology / haemato-oncology",
    experience: 17,
    experienceDisplay: "17+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official + Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 950,
    rating: "4.8",
    totalRatings: 135,
    totalPatients: 990,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&q=80",
    bio: "Dr. Kishore Kumar is a Consultant in Haematology Oncology at MIOT International with over 17 years of specialized practice trained at PGIMER, managing blood disorders and hematological malignancies."
  },

  // ── 16. Endocrinology ──
  {
    name: "Dr. Sundararajan Sridhar",
    specialization: "Endocrinology",
    qualification: "Not fully stated in source checked",
    designation: "HOD - Endocrinology",
    expertise: "Diabetes; obesity; diabetic foot/gangrene; endocrine disorders",
    experience: 40,
    experienceDisplay: "40+ years listed by Vaidam",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Vaidam",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1000,
    rating: "4.9",
    totalRatings: 340,
    totalPatients: 2800,
    gender: "male",
    avatar: "/doctors/doctor_sundararajan_sridhar.png",
    bio: "Dr. Sundararajan Sridhar is HOD of Endocrinology at MIOT International with over 40 years of illustrious clinical practice in diabetes, diabetic foot and gangrene management, obesity, and hormone disorders."
  },

  // ── 17. Infectious Diseases ──
  {
    name: "Dr. Melissa Sathyan",
    specialization: "Infectious Diseases",
    qualification: "Qualification / experience not publicly stated in source checked",
    designation: "Infectious Disease Specialist",
    expertise: "Infectious Diseases",
    experience: 10,
    experienceDisplay: "Not publicly stated",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Justdial",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 800,
    rating: "4.7",
    totalRatings: 92,
    totalPatients: 710,
    gender: "female",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    bio: "Dr. Melissa Sathyan is an Infectious Disease Specialist at MIOT International managing acute fevers, tropical and bacterial infections, viral illnesses, and public health disease protocols."
  },

  // ── 18. Gastroenterology ──
  {
    name: "Dr. S. Palaniappan",
    specialization: "Gastroenterology",
    qualification: "MBBS; MD; DM",
    designation: "Consultant - Medical Gastroenterology",
    expertise: "ERCP; EUS; endoscopy",
    experience: 34,
    experienceDisplay: "34+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MediJourney",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 950,
    rating: "4.9",
    totalRatings: 290,
    totalPatients: 2300,
    gender: "male",
    avatar: "/doctors/doctor_s_palaniappan.png",
    bio: "Dr. S. Palaniappan is a Consultant in Medical Gastroenterology at MIOT International with over 34 years of experience specializing in advanced ERCP, endoscopic ultrasound (EUS), and diagnostic/therapeutic endoscopy."
  },
  {
    name: "Dr. Ilango Sethu",
    specialization: "Gastroenterology",
    qualification: "MBBS; MS; M.Ch",
    designation: "Consultant - Surgical Gastroenterology",
    expertise: "Surgical gastroenterology",
    experience: 17,
    experienceDisplay: "17+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MediJourney",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 900,
    rating: "4.8",
    totalRatings: 155,
    totalPatients: 1100,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&q=80",
    bio: "Dr. Ilango Sethu is a Consultant in Surgical Gastroenterology at MIOT International with over 17 years of experience in gastrointestinal, hepatobiliary, and advanced surgical procedures."
  },
  {
    name: "Dr. Prakasam Rangaswamy K",
    specialization: "Gastroenterology",
    qualification: "MBBS; MS - General Surgery; Fellowship",
    designation: "Senior Consultant - Upper GI & Colorectal Surgery",
    expertise: "Upper GI and colorectal surgery",
    experience: 23,
    experienceDisplay: "23 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 850,
    rating: "4.8",
    totalRatings: 140,
    totalPatients: 1050,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&q=80",
    bio: "Dr. Prakasam Rangaswamy K is a Senior Consultant in Upper GI & Colorectal Surgery at MIOT International with 23 years of specialized experience in upper gastrointestinal and colorectal surgeries."
  },
  {
    name: "Dr. A. Murali",
    specialization: "Gastroenterology",
    qualification: "Not publicly stated in source checked",
    designation: "Gastroenterologist",
    expertise: "Gastroenterology",
    experience: 42,
    experienceDisplay: "42 years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1000,
    rating: "4.9",
    totalRatings: 310,
    totalPatients: 2600,
    gender: "male",
    avatar: "/doctors/doctor_a_murali.png",
    bio: "Dr. A. Murali is a Gastroenterologist at MIOT International with 42 years of extensive experience diagnosing and treating comprehensive digestive and liver diseases."
  },

  // ── 19. Emergency Medicine ──
  {
    name: "MIOT Emergency Care Team",
    specialization: "Emergency Medicine",
    qualification: "Individual qualifications not publicly exposed on MIOT emergency page checked",
    designation: "Emergency Care Team",
    expertise: "24-hour emergency care",
    experience: 20,
    experienceDisplay: "Not publicly stated",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 500,
    rating: "4.9",
    totalRatings: 450,
    totalPatients: 3800,
    gender: "other",
    avatar: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    bio: "The MIOT Emergency Care Team provides round-the-clock 24-hour critical care, acute trauma resuscitation, cardiac emergency stabilization, and rapid emergency interventions."
  },

  // ── 20. General Surgery ──
  {
    name: "Dr. Karthik Mathivanan",
    specialization: "General Surgery",
    qualification: "MBBS; DNB - General Surgery; Fellowship - Liver Transplant & Hepato-Biliary Surgery",
    designation: "Senior Consultant & Associate Director - Liver Transplantation",
    expertise: "Hepato-pancreato-biliary surgery; liver transplantation",
    experience: 18,
    experienceDisplay: "18+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "Credihealth",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1000,
    rating: "4.9",
    totalRatings: 180,
    totalPatients: 1350,
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Dr. Karthik Mathivanan is a Senior Consultant & Associate Director of Liver Transplantation at MIOT International with over 18 years of expertise in hepato-pancreato-biliary surgery and liver transplants."
  },
  {
    name: "Dr. Surendran Rajagopal",
    specialization: "General Surgery",
    qualification: "MBBS; MS; MNAMS; M.Ch",
    designation: "Chairman Emeritus - Hepato-Pancreato-Biliary Surgery & Liver Transplantation",
    expertise: "Hepato-pancreato-biliary surgery; liver transplantation",
    experience: 20,
    experienceDisplay: "20+ years",
    hospitalPhone: "+91 44 42002288",
    emergencyPhone: "105710",
    informationSource: "MIOT official",
    clinicName: "MIOT International",
    clinicAddress: "4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089",
    consultationFee: 1200,
    rating: "5.0",
    totalRatings: 290,
    totalPatients: 2100,
    gender: "male",
    avatar: "/doctors/doctor_surendran_rajagopal.png",
    bio: "Dr. Surendran Rajagopal is Chairman Emeritus of Hepato-Pancreato-Biliary Surgery & Liver Transplantation at MIOT International with over 20 years of renowned leadership in HPB surgery and liver transplants."
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartcare';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');

    // Clear existing seed doctor and department data safely, preserving registered patients!
    console.log('Clearing existing seed data...');
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({ role: 'doctor' });
    await User.deleteMany({ email: 'patient@smartcare.com' });
    await Patient.deleteMany({ 'emergencyContact.name': 'Jane Doe' });
    await Department.deleteMany({});

    // Seed Departments
    const insertedDepts = await Department.insertMany(departmentsData);
    console.log(`Seeded ${insertedDepts.length} departments.`);

    const deptMap = {};
    insertedDepts.forEach((d) => {
      deptMap[d.name] = d._id;
    });

    // Seed Hospitals (MIOT International only)
    const insertedHospitals = await Hospital.insertMany(hospitalData);
    console.log(`Seeded ${insertedHospitals.length} hospital (MIOT International).`);

    // Seed Admin if not present
    const adminExists = await User.findOne({ email: 'admin@smartcare.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@smartcare.com',
        password: 'password123',
        role: 'admin',
        isActive: true,
      });
      console.log('Created Admin: admin@smartcare.com / password123');
    }

    // Seed Real MIOT Doctors from official directory
    const emailTracker = new Map();
    for (let i = 0; i < doctorData.length; i++) {
      const doc = doctorData[i];
      const cleanName = doc.name.replace(/[^a-zA-Z]/g, '').toLowerCase();
      const cleanSpec = doc.specialization.replace(/[^a-zA-Z]/g, '').toLowerCase();
      let email = `${cleanName}.${cleanSpec}@miot.com`;

      // Check if this exact email was already used; if so, append index
      if (emailTracker.has(email)) {
        email = `${cleanName}.${cleanSpec}${i}@miot.com`;
      }
      emailTracker.set(email, true);

      // Use create with fallback to findOne for duplicate emails
      let user;
      try {
        user = await User.create({
          name: doc.name,
          email,
          password: 'password123',
          role: 'doctor',
          isApproved: true,
          isActive: true,
          gender: doc.gender,
          avatar: doc.avatar,
          phone: doc.hospitalPhone,
        });
      } catch (createErr) {
        if (createErr.code === 11000) {
          user = await User.findOne({ email });
        } else {
          throw createErr;
        }
      }

      let deptId = deptMap[doc.specialization];
      if (!deptId) {
        if (doc.specialization.includes('Obstetrics') || doc.specialization.includes('Gynecology')) {
          deptId = deptMap['Obstetrics & Gynecology'];
        } else {
          deptId = insertedDepts[0]._id;
        }
      }

      await Doctor.create({
        user: user._id,
        department: deptId,
        specialization: doc.specialization,
        qualification: doc.qualification,
        designation: doc.designation,
        expertise: doc.expertise,
        experience: doc.experience,
        experienceDisplay: doc.experienceDisplay,
        hospitalPhone: doc.hospitalPhone,
        emergencyPhone: doc.emergencyPhone,
        informationSource: doc.informationSource,
        consultationFee: doc.consultationFee,
        appointmentDuration: 60,
        maxPatientsPerSlot: 10,
        rating: doc.rating,
        totalRatings: doc.totalRatings,
        totalPatients: doc.totalPatients,
        clinicName: doc.clinicName,
        clinicAddress: doc.clinicAddress,
        bio: doc.bio,
        schedule: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => ({
          day,
          isAvailable: true,
          slots: [
            { start: '09:30', end: '10:30' },
            { start: '10:30', end: '11:30' },
            { start: '11:30', end: '12:30' },
            { start: '13:30', end: '14:30' },
            { start: '14:30', end: '15:30' },
            { start: '15:30', end: '16:30' },
            { start: '16:30', end: '17:00' },
            { start: '17:30', end: '18:30' },
            { start: '18:30', end: '19:30' },
            { start: '19:30', end: '20:30' },
            { start: '20:30', end: '21:30' },
          ],
          breakSlots: [
            { start: '12:30', end: '13:30' },
            { start: '17:00', end: '17:30' },
          ],
        })).concat([
          { day: 'sunday', isAvailable: false, slots: [], breakSlots: [] },
        ]),
      });
    }
    console.log(`Seeded ${doctorData.length} MIOT International doctors across 20 medical categories.`);

    // Seed Demo Patient if not present
    const patientExists = await User.findOne({ email: 'patient@smartcare.com' });
    if (!patientExists) {
      const demoPatientUser = await User.create({
        name: 'John Doe',
        email: 'patient@smartcare.com',
        password: 'password123',
        role: 'patient',
        gender: 'male',
        isActive: true,
      });
      await Patient.create({
        user: demoPatientUser._id,
        bloodGroup: 'O+',
        dateOfBirth: new Date('1995-06-15'),
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+91 98765 43210',
        },
      });
    }

    console.log('\n========================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`- 20 Departments`);
    console.log(`- ${insertedHospitals.length} Hospital (MIOT International)`);
    console.log(`- ${doctorData.length} MIOT International Doctors`);
    console.log(`- Hospital Contact: +91 44 42002288 | Emergency: 105710`);
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed DB Error:', err);
    process.exit(1);
  }
};

seedDB();
