export const NAVIGATION_MENUS = {
  facilities: {
    id: 'facilities',
    navKey: 'FACILITIES & RESOURCES',
    tabs: [
      {
        id: 'facilities',
        label: 'FACILITIES',
        bgColor: '#EFA00B',
        hoverColor: '#D99008',
        columns: [
          {
            items: [
              { id: 'rehab', title: 'MIOT REHAB CENTRE', desc: 'Comprehensive state-of-the-art neurological, orthopedic, and sports rehabilitation centre.' },
              { id: 'radiology', title: 'Radiology & Imaging Sciences', desc: 'Full spectrum 24x7 advanced diagnostic imaging with low-dose radiation protocols.' },
              { id: 'digital-cath-lab', title: 'Digital Cath Lab', desc: 'Next-gen cardiovascular digital fluoroscopy and stent placement suites.' },
              { id: '3t-mri', title: '3T MRI', desc: 'Quiet, wide-bore 3-Tesla MRI imaging delivering unmatched high-resolution clarity.' },
              { id: 'campus-facilities', title: 'Campus Facilities', desc: 'Sprawling 14-acre lush green healing campus designed to international safety standards.' },
              { id: 'critical-care', title: 'Critical & Intensive Care', desc: 'Multi-specialty ICUs with 1:1 dedicated nursing and advanced hemodynamic monitoring.' },
              { id: 'robotic-surgery', title: 'MIOT Institute Of Robotic Surgery', desc: 'Computer-guided robotic surgery for precise joint replacements and minimal invasive procedures.' },
            ]
          },
          {
            items: [
              { id: 'bodytom', title: 'BodyTom Mobile CT Scan', desc: 'World’s first portable, full-body 32-slice CT scanner for intra-operative precision.' },
              { id: 'physiotherapy', title: 'Physiotherapy', desc: 'Personalized mobility, gait training, and muscle restoration led by expert physiotherapists.' },
              { id: 'mammography', title: '3D Digital Mammography System', desc: 'Painless high-definition 3D breast tomosynthesis for ultra-early cancer detection.' },
              { id: 'lab-services', title: 'Laboratory Services', desc: 'NABL accredited 24x7 automated pathology, biochemistry, and microbiology labs.' },
              { id: 'gallery', title: 'Gallery', desc: 'Photo and media tour of world-class hospital suites, wards, and surgical complexes.' },
              { id: 'telemedicine', title: 'MIOT Telemedicine', desc: 'Virtual video consultations connecting patients globally with top specialist doctors.' },
            ]
          },
          {
            items: [
              { id: 'biplane-cathlab', title: 'Biplane CathLab', desc: 'Dual-axis high-speed neurovascular imaging for real-time stroke and aneurysm intervention.' },
              { id: 'nuclear-pet', title: 'Nuclear Medicine & PET CT', desc: 'Molecular cancer staging and accurate metabolic tumor tracking with PET-CT.' },
              { id: 'blood-bank', title: 'Blood Bank', desc: '24x7 licensed component blood bank with state-of-the-art apheresis and NAT screening.' },
              { id: 'operation-theatres', title: 'Operation Theatres', desc: '21 laminar airflow modular operating suites maintaining 99.97% clean-room sterile air.' },
              { id: 'virtual-tour', title: 'MIOT 360° Virtual Tour Video', desc: 'Immersive interactive 360-degree virtual tour of MIOT international campus and facilities.' },
              { id: 'arthroplasty-museum', title: 'MIOT Museum Arthroplasty', desc: 'The world’s exclusive orthopedic museum showcasing four decades of joint replacement evolution.' },
            ]
          }
        ]
      },
      {
        id: 'resources',
        label: 'RESOURCES',
        bgColor: '#1F54B0',
        hoverColor: '#163E85',
        columns: [
          {
            items: [
              { id: 'admission-guide', title: 'Patient Admission & Discharge Guide', desc: 'Step-by-step assistance for smooth, hassle-free admission and planned discharge processes.' },
              { id: 'insurance-tpa', title: 'Insurance & Cashless TPA Desk', desc: 'Empanelled with leading Indian and international insurance TPAs for cashless hospitalization.' },
              { id: 'emergency-directory', title: 'Emergency Contact Directory', desc: 'Direct 24x7 hotlines for trauma, pediatric emergencies, stroke, and cardiac care.' },
              { id: 'patient-rights', title: 'Patient Rights & Responsibilities', desc: 'Our transparent charter of patient care, ethical standards, and safety commitments.' }
            ]
          },
          {
            items: [
              { id: 'gold-card', title: 'MIOT Gold Card Privilege Program', desc: 'Exclusive health benefits, priority appointments, and discounts for enrolled family members.' },
              { id: 'medical-records', title: 'Medical Records Request Portal', desc: 'Securely request and retrieve digital case summaries, lab reports, and discharge documents.' },
              { id: 'diet-nutrition', title: 'Dietary & Clinical Nutrition Services', desc: 'Customized therapeutic nutrition planned by certified clinical dietitians.' },
              { id: 'pharmacy-delivery', title: '24x7 Pharmacy & Home Medicine Delivery', desc: 'Genuine prescribed medications delivered reliably to your doorstep across Chennai.' }
            ]
          },
          {
            items: [
              { id: 'ambulance-services', title: 'Air & Ground Ambulance Support', desc: 'Advanced life support (ALS) ambulances equipped with mobile ventilators and defibrillators.' },
              { id: 'patient-portal', title: 'SmartCare Digital Patient App', desc: 'Access your doctor bookings, lab test results, and live queue status on your smartphone.' },
              { id: 'visitor-guidelines', title: 'Visitor Guidelines & Attendant Passes', desc: 'Health safety guidelines and caregiver pass instructions to ensure quiet recovery.' },
              { id: 'download-forms', title: 'Download Patient Forms & Brochures', desc: 'Pre-admission forms, medical visa recommendation formats, and specialty brochures.' }
            ]
          }
        ]
      }
    ]
  },

  programmes: {
    id: 'programmes',
    navKey: 'PROGRAMMES & EDUCATION',
    tabs: [
      {
        id: 'programmes',
        label: 'PROGRAMMES',
        bgColor: '#EFA00B',
        hoverColor: '#D99008',
        columns: [
          {
            items: [
              { id: 'emergency-care', title: 'MIOT Emergency Care', desc: 'Rapid 10-57-10 response for cardiac arrest, polytrauma, stroke, and critical poisoning.' },
              { id: 'organ-drive', title: 'MIOT Organ Drive (MODE)', desc: 'Pioneering cadaver and living donor organ transplant advocacy and awareness movement.' },
              { id: 'ortho-trauma', title: 'MIOT Orthopaedics & Trauma Consultation', desc: 'Specialized round-the-clock emergency bone fracture and multi-trauma care.' },
              { id: 'post-covid', title: 'Post COVID Lung Care', desc: 'Targeted pulmonary rehabilitation and fibrosis monitoring for recovered patients.' },
              { id: 'parkinsons-clinic', title: 'Integrated Health Care Clinic For Parkinson\'s Disease', desc: 'Multidisciplinary movement disorder evaluation combining neurology, deep brain stimulation, and speech therapy.' },
            ]
          },
          {
            items: [
              { id: 'covid-initiatives', title: 'COVID-19 Initiatives', desc: 'Dedicated negative-pressure isolation wards, screening clinics, and safety protocols.' },
              { id: 'chime', title: 'CHIME', desc: 'Children’s Heart Intervention and Making Everyday smiles — charitable pediatric cardiac surgeries.' },
              { id: 'dbs-clinic', title: 'DBS Clinic', desc: 'Advanced Deep Brain Stimulation neurosurgery for Parkinson\'s, tremors, and dystonia.' },
              { id: 'unlock-mind', title: 'Unlock Your Mind', desc: 'Compassionate mental wellness, stress relief, and psychological counseling program.' },
              { id: 'pae-clinic', title: 'Prostatic Artery Embolization (PAE) Clinic', desc: 'Minimally invasive, pin-hole interventional radiology treatment for enlarged prostate (BPH).' },
              { id: 'fibroid-clinic', title: 'Fibroid Clinic', desc: 'Uterine Artery Embolization (UAE) to eliminate fibroids without open surgery or hysterectomy.' },
              { id: 'gae-clinic', title: 'Genicular Artery Embolization (GAE)', desc: 'Cutting-edge non-surgical pinhole treatment for chronic osteoarthritic knee pain.' },
            ]
          },
          {
            items: [
              { id: 'master-health', title: 'Master Health Check Up', desc: 'Comprehensive whole-body wellness screening packages designed for every age group.' },
              { id: 'liver-gym', title: 'MIOT Liver Gym', desc: 'Personalized hepatology regimen to reverse fatty liver disease and prevent cirrhosis.' },
              { id: 'heart-failure-camp', title: 'Heart Failure Camp', desc: 'Community screening, cardiac biomarker profiling, and advanced heart failure clinics.' },
              { id: 'covid-vaccine', title: 'COVID Vaccination', desc: 'Certified safe immunization center offering government-approved booster and primary doses.' },
              { id: 'scoliosis-clinic', title: 'Scoliosis Clinic', desc: 'Pediatric and adult spinal deformity correction using computerized intraoperative neuromonitoring.' },
              { id: 'pancreatic-clinic', title: 'High Risk Pancreatic Diseases Clinic', desc: 'Early detection and surgical eradication of complex pancreatic tumors and pancreatitis.' },
              { id: 'urinary-incontinence', title: 'Urinary Incontinence Clinic', desc: 'Specialized urogynecological and pelvic floor rehabilitation for bladder control restoration.' },
            ]
          }
        ]
      },
      {
        id: 'education',
        label: 'EDUCATION',
        bgColor: '#1F54B0',
        hoverColor: '#163E85',
        columns: [
          {
            items: [
              { id: 'allied-health', title: 'MIOT Academy of Allied Health Sciences (MAAHS)', desc: 'Affiliated degree programs in Operation Theatre, Imaging, and Cardiac Technology.' },
              { id: 'nursing-college', title: 'MIOT College of Nursing', desc: 'Recognized B.Sc. & M.Sc. Nursing curriculum with extensive hands-on bedside clinical exposure.' },
              { id: 'dnb-programs', title: 'DNB Post Graduate Medical Residency', desc: 'National Board accredited residency in Orthopedics, Anaesthesia, and General Surgery.' }
            ]
          },
          {
            items: [
              { id: 'fellowships', title: 'Post-Doctoral Surgical Fellowships', desc: 'Advanced fellowship training in Joint Replacement, Arthroscopy, and Spine Surgery.' },
              { id: 'cme-conferences', title: 'CME Conferences & Symposia', desc: 'Regular academic symposiums hosting international thought leaders and surgical workshops.' },
              { id: 'clinical-observerships', title: 'International Clinical Observerships', desc: 'Short-term and long-term observational programs for visiting foreign medical graduates.' }
            ]
          },
          {
            items: [
              { id: 'skills-lab', title: 'Surgical Simulation & Skills Lab', desc: 'Realistic simulation models and wet-lab workstations for laparoscopic and arthroscopic training.' },
              { id: 'research-board', title: 'MIOT Institutional Ethics & Research Board', desc: 'Dedicated clinical trials, bio-mechanic implant research, and scientific paper publications.' },
              { id: 'student-portal', title: 'Admissions & Academic Prospectus', desc: 'Download current year application forms, fee structures, and entrance examination details.' }
            ]
          }
        ]
      }
    ]
  },

  patients: {
    id: 'patients',
    navKey: 'PATIENTS & VISITORS',
    tabs: [
      {
        id: 'patients-visitors',
        label: 'PATIENTS & VISITORS',
        bgColor: '#1F54B0',
        hoverColor: '#163E85',
        columns: [
          {
            items: [
              { id: 'visitors-policy', title: 'Visitors Policy', desc: 'Guidelines ensuring quiet healing environment, attendant pass policies, and infection control.' },
              { id: 'patient-video-testimonials', title: 'Patient Video Testimonials', desc: 'Inspiring video stories and genuine experiences shared by patients treated at MIOT.' }
            ]
          },
          {
            items: [
              { id: 'visiting-hours', title: 'Visiting Hours', desc: 'Visiting hours: 4:30 PM to 7:00 PM daily. ICU visiting hours strictly restricted to designated slots.' },
              { id: 'my-hospital-miot', title: 'My Hospital MIOT', desc: 'Patient orientation guide covering cafeteria, accommodation, prayer rooms, and helpdesks.' }
            ]
          },
          {
            items: [
              { id: 'patient-testimonials', title: 'Patient Testimonials', desc: 'Read heartfelt written reviews and clinical feedback from thousands of treated patients worldwide.' }
            ]
          }
        ]
      }
    ]
  },

  global: {
    id: 'global',
    navKey: 'GLOBAL CENTERS',
    tabs: [
      {
        id: 'global-presence',
        label: 'GLOBAL PRESENCE',
        bgColor: '#EFA00B',
        hoverColor: '#D99008',
        columns: [
          {
            items: [
              { id: 'global-network', title: 'Our Global Network', desc: 'Connecting patients across 129 countries through regional consultation centres and liaison desks.' }
            ]
          },
          {
            items: [
              { id: 'intl-care-services', title: 'International Patient Care Services', desc: 'Dedicated concierge team providing medical opinion, visa invitations, airport transfers, and language interpreters.' }
            ]
          }
        ]
      },
      {
        id: 'global-centres',
        label: 'GLOBAL CENTRES',
        bgColor: '#1F54B0',
        hoverColor: '#163E85',
        columns: [
          {
            items: [
              { id: 'seychelles', title: 'MIOT Seychelles Consultation Office', desc: 'Full-time visiting specialist consultations and direct triage for complex orthopedic care in Victoria.' },
              { id: 'maldives', title: 'MIOT Maldives Liaison Desk', desc: 'Facilitating Aasandha health scheme authorizations, tele-consults, and travel assistance in Malé.' },
              { id: 'mauritius', title: 'Mauritius Regional Desk', desc: 'Dedicated referral coordinator assisting patients across Port Louis and Indian Ocean islands.' }
            ]
          },
          {
            items: [
              { id: 'middle-east', title: 'Oman & UAE Information Centre', desc: 'Liaison office supporting Gulf patients seeking advanced joint replacement and cancer care.' },
              { id: 'africa-desk', title: 'East & West Africa Care Desks', desc: 'Active liaison offices in Kenya, Tanzania, Nigeria, and Ghana for seamless medical travel.' },
              { id: 'intl-concierge', title: 'International Medical Concierge Desk', desc: 'Direct WhatsApp & hotline for complimentary second opinions and estimated treatment cost plans.' }
            ]
          }
        ]
      }
    ]
  }
};
