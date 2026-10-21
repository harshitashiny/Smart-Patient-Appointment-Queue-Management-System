export const INSTITUTES_DATA = [
  {
    id: 'orthopaedics',
    name: 'MIOT INSTITUTE OF ORTHOPAEDICS',
    shortName: 'MIOT Institute of Orthopaedics',
    color: '#0B2545',
    accentColor: '#EFA00B',
    dept: 'Orthopedics',
    items: [
      {
        id: 'joint-replacement',
        title: 'Joint Replacement And Revision Surgery',
        tagline: 'MIOT Joint for Life Programme',
        overview: 'At the renowned MIOT Hospitals Joint for Life programme, our experienced surgeons use the latest techniques and materials to find the perfect implant for every patient – one that suits their age, anatomy and lifestyle, and fits comfortably, enabling them to return to an active life.',
        restoringMobilityTitle: 'Restoring mobility',
        restoringMobilityText: 'Genetics, nutrition, activity and lifestyle are the cause for changes, over time, in our bones and joints. You could need a joint replacement surgery for a number of reasons: injury, bone disease, reduced blood supply, the wearing out of the joint due to wear and tear associated with age, etc. A joint replacement is a permanent solution to relieve pain and restore movement in the affected joint. Today, medical advancements have made it possible to replace our natural joints with artificial ones that are made from metal, polymers, ceramic or plastic. In the MIOT Joint for Life Programme, our expert surgeons perform replacement surgery of the knee, hip and shoulder. Backed by over 40 years of experience and more than 40,000 replacement surgeries and counting – MIOT Hospitals use current technologies and treatments to find that right implant to give you a joint that will last a lifetime.',
        imageType: 'ortho',
        accordions: [
          {
            title: 'Getting the right bond',
            content: 'Our surgeons evaluate joint geometry, bone mineral density, and biomechanical axis to select cemented, uncemented, or hybrid fixation, ensuring a durable, permanent bond between implant and bone.'
          },
          {
            title: 'Choosing the right time and centre',
            content: 'Early intervention prevents irreversible bone loss and muscle atrophy. MIOT is equipped with ultra-clean laminar air flow theatres reducing infection rates to near zero (0.06%).'
          },
          {
            title: 'Advanced facilities, expert surgical teams',
            content: 'Features high-definition computer navigation, minimally invasive pin-hole surgical instrumentation, and intraoperative 3D fluoroscopy for millimeter precision.'
          },
          {
            title: 'A centre for revision surgery',
            content: 'Recognized globally as a referral centre for complex failed surgeries performed elsewhere, specializing in extensive bone grafting, custom mega-prostheses, and hinge reconstructions.'
          }
        ]
      },
      {
        id: 'knee-replacement',
        title: 'Knee Replacement And Revision',
        icon: 'knee',
        hasJointForLifeBanner: true,
        tagline: 'MIOT Joint for Life - Hip and Knee Replacement Surgeries',
        overview: "Total knee replacement is offered as part of MIOT’s Joint for Life programme which has, in fact, pioneered computer-navigated total knee replacement in the region.",
        sections: [
          {
            heading: 'Total knee replacement',
            text: 'Arthritis of the knees is extremely common in India. A knee replacement offers patients a permanent solution to this painful, and often debilitating, condition. At MIOT International Hospital, our surgeons with experience of over 12,000 knee replacements correct every kind of knee deformity, from the mild to the extremely severe, using the most advanced prostheses in the world, including the hi-flex knee which offers maximum flexion. Special anaesthetic techniques, with combined spinal epidural anaesthesia and nerve blocks, enable the department to offer knee replacement to the elderly with multiple, coexisting medical disease conditions.'
          }
        ],
        imageType: 'knee_ot',
        afterImageSections: [
          {
            heading: 'Computer-navigated total knee replacement',
            text: 'MIOT introduced computer-navigated total knee replacement, which helps surgeons balance the ligaments and place the prosthesis with zero error, thereby improving the longevity of the joint. The MIOT Centre for Orthopaedics also offers minimally-invasive total knee replacement, where the procedure is performed through an incision that is just 8 – 10 centimetres wide. Post surgery, patients are put on a Continuous Passive Motion (CPM) machine, they are encouraged to walk the day after surgery, climb staircases in five (5) days and are discharged seven (7) days after the new joint has been implanted. Most patients recover completely in three weeks time.'
          },
          {
            heading: 'Revision surgery of the knee',
            text: 'Failure of total knee replacements done elsewhere due to failure of the implant, wear and tear and loosening is rectified at MIOT International by special revision knee prosthesis. Patients with knee replacements, who have accidents and periprosthetic fractures, can also be fitted internally with special implants. The results are excellent and tailor-made to suit each individual patient.'
          }
        ],
        accordions: []
      },
      {
        id: 'hip-replacement',
        title: 'Hip Replacement And Revision',
        tagline: 'Restoring Pain-Free Hip Range of Motion',
        overview: 'From avascular necrosis to developmental dysplasia, MIOT surgeons utilize ceramic-on-ceramic and ceramic-on-crosslinked polyethylene bearings for virtually zero wear.',
        restoringMobilityTitle: 'Freedom from Hip Pain',
        restoringMobilityText: 'Hip replacements at MIOT are performed via muscle-sparing approaches, enabling early weight-bearing and same-day or next-day mobilization for enhanced recovery.',
        imageType: 'ortho',
        accordions: [
          {
            title: 'Ceramic Bearings for Longevity',
            content: 'Ultra-smooth ceramic surfaces minimize particle wear and eliminate risks of metal ion release, ideal for active younger patients.'
          },
          {
            title: 'Revision & Reconstruction',
            content: 'Acetabular reconstruction using 3D printed cages and biological bone graft integration for severe pelvic bone loss.'
          }
        ]
      },
      {
        id: 'upper-limb',
        title: 'Upper Limb',
        tagline: 'Shoulder, Elbow, Wrist & Micro-vascular Care',
        overview: 'Specialized interventions for shoulder rotator cuff tears, reverse total shoulder replacement, elbow reconstruction, and complex brachial plexus micro-surgery.',
        restoringMobilityTitle: 'Upper Extremity Precision',
        restoringMobilityText: 'Reconstructing delicate nerves, tendons, and articulating joints restores independent living, occupational dexterity, and sports performance.',
        imageType: 'ortho',
        accordions: [
          {
            title: 'Reverse Shoulder Arthroplasty',
            content: 'Revolutionary solution for patients with combined arthritis and irreparable rotator cuff deficiency.'
          }
        ]
      },
      {
        id: 'spine-surgery',
        title: 'Spine Surgery',
        tagline: 'Minimally Invasive & Deformity Correction',
        overview: 'Comprehensive treatment for herniated discs, spinal canal stenosis, scoliosis deformity correction, and complex spinal trauma.',
        restoringMobilityTitle: 'Relieving Nerve Compression & Restoring Posture',
        restoringMobilityText: 'Employing micro-endoscopic discectomy and intraoperative neuromonitoring to ensure maximal spinal safety and rapid rehabilitation.',
        imageType: 'ortho',
        accordions: [
          {
            title: 'Minimally Invasive Spine Procedures',
            content: 'Keyhole discectomy and robotic transpedicular stabilization with minimal blood loss and 24-hour discharge.'
          }
        ]
      },
      {
        id: 'sports-medicine',
        title: 'Sports Medicine',
        tagline: 'Ligament Reconstruction & Athletic Rehabilitation',
        overview: 'Advanced arthroscopic repair for ACL, PCL, meniscus tears, shoulder labral injuries, and cartilage restoration therapies.',
        restoringMobilityTitle: 'Return to Play',
        restoringMobilityText: 'Our multidisciplinary sports physicians, orthopaedic surgeons, and biomechanical physiotherapists get elite athletes and weekend warriors back on the field.',
        imageType: 'ortho',
        accordions: [
          {
            title: 'Biological Cartilage Restoration',
            content: 'Autologous chondrocyte implantation and platelet-rich plasma therapies promoting rapid joint healing.'
          }
        ]
      },
      {
        id: 'trauma-care',
        title: 'Trauma Care',
        tagline: 'Level-1 Emergency Musculoskeletal Trauma',
        overview: 'The founding cornerstone of MIOT International. Dedicated 24/7 polytrauma teams, rapid CT diagnostics, and emergency limb salvage surgeries.',
        restoringMobilityTitle: 'Golden Hour Resuscitation',
        restoringMobilityText: 'Immediate surgical intervention for pelvic fractures, multi-fragmentary long bone trauma, and industrial injuries with microvascular limb replantation.',
        imageType: 'ortho',
        accordions: [
          {
            title: '24x7 Trauma Operating Suites',
            content: 'Immediate access to sterile lamin-air flow suites with blood bank backing and senior consultant trauma surgeons.'
          }
        ]
      }
    ]
  },
  {
    id: 'cardiac',
    name: 'MIOT INSTITUTE OF CARDIAC CARE',
    shortName: 'MIOT Institute of Cardiac Care',
    color: '#881337',
    accentColor: '#D81E5B',
    dept: 'Cardiology',
    items: [
      {
        id: 'cardiac-overview',
        title: 'MIOT Institute Of Cardiac Care - Overview',
        tagline: 'Comprehensive Heart & Vascular Excellence',
        overview: 'MIOT Institute of Cardiac Care integrates cutting-edge interventional cardiology, coronary bypass surgery, and cardiac electrophysiology with 24/7 Heart Revive emergency response.',
        restoringMobilityTitle: 'Protecting Every Heartbeat',
        restoringMobilityText: 'Our high-volume cardiac center has treated hundreds of thousands of cardiac patients with success rates matching international gold standards. Supported by dual-source biplane cath labs and dedicated cardiac intensive care.',
        imageType: 'cardiac',
        accordions: [
          {
            title: '24/7 Primary Angioplasty',
            content: 'Door-to-balloon time under 50 minutes for acute myocardial infarction, restoring heart blood supply with life-saving speed.'
          },
          {
            title: 'Heart Revive Emergency Unit',
            content: 'Instant triaging with ECMO capability, cardiac monitors, and on-duty cardiologists 24 hours a day.'
          }
        ]
      },
      {
        id: 'thoracic-cardiovascular',
        title: 'Thoracic And Cardiovascular Care',
        tagline: 'Beating Heart Surgery & Valve Repair',
        overview: 'Specialized cardiac surgeons perform off-pump CABG (beating heart bypass), minimally invasive valve replacements, and complex aortic aneurysm repairs.',
        restoringMobilityTitle: 'Surgical Heart Innovation',
        restoringMobilityText: 'Minimally invasive keyhole cardiac incisions significantly reduce post-operative pain and hospital stay, enabling rapid return to regular life.',
        imageType: 'cardiac',
        accordions: [
          {
            title: 'Total Arterial Revascularization',
            content: 'Utilizing bilateral internal mammary arteries for exceptional graft patency lasting over 20 years.'
          }
        ]
      },
      {
        id: 'interventional-cardiology',
        title: 'Interventional Cardiology',
        tagline: 'Complex Stenting & Transcatheter Valve Repair',
        overview: 'High-precision transradial coronary angioplasty, bio-absorbable stents, rotablation for calcified arteries, and non-surgical TAVR / TAVI valve implants.',
        restoringMobilityTitle: 'Pin-Hole Heart Interventions',
        restoringMobilityText: 'Patients undergo artery clearing through wrist arteries with same-day mobility and minimal downtime.',
        imageType: 'cardiac',
        accordions: [
          {
            title: 'TAVR / TAVI Expertise',
            content: 'Replacing aortic heart valves via catheters without open-heart surgery for high-risk elderly patients.'
          }
        ]
      },
      {
        id: 'heart-revive',
        title: 'MIOT Heart Revive (Cardiac Emergency)',
        tagline: '24/7 Emergency Heart Attack Protocol',
        overview: 'A rapid-response emergency unit engineered to reverse cardiac arrests, massive heart attacks, and severe cardiogenic shock in the Golden Hour.',
        restoringMobilityTitle: 'Immediate Emergency Care',
        restoringMobilityText: 'Direct dial 10 57 10 connects ambulances with doctors who transmit ECGs in transit, preparing catheterization labs before patient arrival.',
        imageType: 'cardiac',
        accordions: [
          {
            title: 'Rapid Triage Pathway',
            content: 'Immediate ECG within 3 minutes and direct transfer to cath lab bypasses delays.'
          }
        ]
      },
      {
        id: 'childrens-cardiac',
        title: "Children's Cardiac Care",
        tagline: 'Pediatric Cardiology & Congenital Heart Care',
        overview: 'Corrective surgery and catheter closure for ventricular septal defects (VSD), atrial septal defects (ASD), tetralogy of Fallot, and complex neonatal heart anomalies.',
        restoringMobilityTitle: 'Giving Young Hearts a Normal Life',
        restoringMobilityText: 'Dedicated pediatric cardiac ICU and specialized perfusionists ensure high surgical safety for infants and children.',
        imageType: 'cardiac',
        accordions: [
          {
            title: 'Non-Surgical Device Closures',
            content: 'Closing holes in the heart through blood vessels without incisions.'
          }
        ]
      }
    ]
  },
  {
    id: 'gastro',
    name: 'CENTER FOR GASTROINTESTINAL AND LIVER DISEASES',
    shortName: 'Center for Gastrointestinal & Liver Diseases',
    color: '#064E3B',
    accentColor: '#10B981',
    dept: 'Gastroenterology',
    items: [
      {
        id: 'medical-gastro',
        title: 'Medical Gastroenterology',
        tagline: 'Advanced Endoscopy & Digestive Health',
        overview: 'Diagnostic and therapeutic endoscopy, colonoscopy, narrow-band imaging, capsule endoscopy, and comprehensive care for acid peptic disease, IBD, and colitis.',
        restoringMobilityTitle: 'Digestive Comfort & Healing',
        restoringMobilityText: 'High-definition video endoscopes detect micro-polyps and early cancer lesions early, facilitating curative endoscopic removal without incisions.',
        imageType: 'gastro',
        accordions: [
          {
            title: 'Therapeutic Endoscopy',
            content: 'Bleeding ulcer clipping, variceal banding, endoscopic mucosal resection (EMR), and polyp removal.'
          }
        ]
      },
      {
        id: 'surgical-gastro',
        title: 'Surgical Gastroenterology',
        tagline: 'Laparoscopic & Robotic GI Surgeries',
        overview: 'Minimally invasive keyhole surgery for gallbladder stones, hernia, colorectal cancer, achalasia cardia, and complex abdominal pathology.',
        restoringMobilityTitle: 'Minimally Invasive Recovery',
        restoringMobilityText: 'Laparoscopic and robotic surgery minimizes pain and scars, allowing resumption of normal eating and activity within days.',
        imageType: 'gastro',
        accordions: [
          {
            title: 'Colorectal Surgical Oncology',
            content: 'Sphincter-preserving surgeries for low rectal cancers utilizing high-magnification robotic arms.'
          }
        ]
      },
      {
        id: 'hpb-surgery',
        title: 'Hepato-Pancreato-Biliary Surgery',
        tagline: 'Liver, Pancreas & Bile Duct Center',
        overview: 'Complex resections for liver cancer, pancreatic tumours (Whipple procedure), biliary strictures, and living-donor liver transplantation.',
        restoringMobilityTitle: 'High-End Hepatic & Pancreatic Solutions',
        restoringMobilityText: 'Multidisciplinary tumor boards and specialized liver ICUs deliver exceptional survival and cure rates.',
        imageType: 'gastro',
        accordions: [
          {
            title: 'Liver Resection & Transplant',
            content: 'Advanced intraoperative ultrasound and CUSA technology for bloodless liver surgery.'
          }
        ]
      },
      {
        id: 'bariatric-surgery',
        title: 'Bariatric Surgery',
        tagline: 'Metabolic & Weight Loss Surgery',
        overview: 'Laparoscopic sleeve gastrectomy and gastric bypass for morbid obesity, reversing type-2 diabetes, hypertension, and sleep apnea.',
        restoringMobilityTitle: 'Metabolic Transformation',
        restoringMobilityText: 'Comprehensive weight management backed by endocrinologists, bariatric surgeons, nutritionists, and psychologists.',
        imageType: 'gastro',
        accordions: [
          {
            title: 'Resolution of Co-morbidities',
            content: 'Over 85% of patients achieve complete remission of diabetes and joint pain.'
          }
        ]
      }
    ]
  },
  {
    id: 'nephrology',
    name: 'MIOT INSTITUTE OF NEPHROLOGY',
    shortName: 'MIOT Institute of Nephrology',
    color: '#78350F',
    accentColor: '#F59E0B',
    dept: 'Nephrology',
    items: [
      {
        id: 'kidney-transplant',
        title: 'Kidney Transplant',
        tagline: 'Live & Deceased Donor Renal Transplantation',
        overview: 'A leading kidney transplant centre with over 98% graft survival rates. Expertise in ABO-incompatible (cross-blood group) transplants and highly sensitized recipients.',
        restoringMobilityTitle: 'Restoring Freedom from Dialysis',
        restoringMobilityText: 'Renal transplant provides true freedom and vitality to patients suffering from end-stage renal disease (ESRD), supported by state-of-the-art tissue HLA-matching labs and sterile transplant suites.',
        imageType: 'nephro',
        accordions: [
          {
            title: 'ABO-Incompatible Transplantation',
            content: 'Allows patients to receive kidney transplants from donors with different blood types via plasma exchange and immunoadsorption.'
          },
          {
            title: 'Laparoscopic Donor Nephrectomy',
            content: 'Keyhole surgery for living kidney donors ensuring minimal pain and quick return to work.'
          }
        ]
      },
      {
        id: 'dialysis',
        title: 'Dialysis',
        tagline: 'High-Flux Hemodialysis & CRRT Unit',
        overview: 'Round-the-clock hemodialysis and online hemodiafiltration (HDF) with ultrapure water systems preventing complications and improving quality of life.',
        restoringMobilityTitle: 'Safe, Comfortable Renal Filtration',
        restoringMobilityText: 'Specialized bedside dialysis for ICU patients with continuous renal replacement therapy (CRRT) and peritoneal dialysis training.',
        imageType: 'nephro',
        accordions: [
          {
            title: 'Online Hemodiafiltration (HDF)',
            content: 'Superior clearance of middle and large molecular toxins compared to standard dialysis.'
          }
        ]
      },
      {
        id: 'interventional-nephro',
        title: 'Interventional Procedures',
        tagline: 'Vascular Access & Renal Angioplasty',
        overview: 'AV fistula creation, AV graft placement, permacath insertion, renal biopsy under real-time ultrasound, and renal artery stenting for renovascular hypertension.',
        restoringMobilityTitle: 'Protecting Dialysis Lifelines',
        restoringMobilityText: 'Interventional nephrologists save failing fistulas with balloon angioplasty, ensuring reliable access for hemodialysis.',
        imageType: 'nephro',
        accordions: [
          {
            title: 'Fistula Salvage Interventions',
            content: 'Emergency declotting and fistuloplasty performed same-day in our angiography suite.'
          }
        ]
      }
    ]
  },
  {
    id: 'cancer',
    name: 'MIOT INSTITUTE OF CANCER CURE',
    shortName: 'MIOT Institute of Cancer Cure',
    color: '#4C1D95',
    accentColor: '#8B5CF6',
    dept: 'Oncology',
    items: [
      {
        id: 'surgical-oncology',
        title: 'Surgical Oncology',
        tagline: 'Radical Tumor Resection & Organ Preservation',
        overview: 'Specialist surgical oncologists perform radical resections for breast, head & neck, gastrointestinal, gynecological, and musculoskeletal cancers with functional reconstruction.',
        restoringMobilityTitle: 'Precision Cancer Surgery',
        restoringMobilityText: 'Organ preservation techniques ensure cancer clearance while maximizing cosmetic and functional outcomes.',
        imageType: 'cancer',
        accordions: [
          {
            title: 'Sentinel Lymph Node Biopsy',
            content: 'Prevents unnecessary extensive lymph node removal, avoiding chronic arm swelling.'
          }
        ]
      },
      {
        id: 'medical-oncology',
        title: 'Medical Oncology',
        tagline: 'Targeted Chemotherapy & Immunotherapy',
        overview: 'Personalized genomic-guided cancer therapies, immunotherapy checkpoint inhibitors, targeted molecular drugs, and comfortable outpatient day-care infusion suites.',
        restoringMobilityTitle: 'Targeted Anti-Cancer Therapy',
        restoringMobilityText: 'Next-generation sequencing matches specific genetic mutations with targeted therapies, offering superior efficacy with fewer side effects.',
        imageType: 'cancer',
        accordions: [
          {
            title: 'Immunotherapy Advances',
            content: 'Unlocking the body’s own immune system to target and eliminate malignant cells.'
          }
        ]
      },
      {
        id: 'radiation-oncology',
        title: 'Radiation Oncology',
        tagline: 'Image-Guided Precision Radiotherapy',
        overview: 'TrueBeam STx linear accelerators providing Intensity-Modulated Radiation Therapy (IMRT), RapidArc, and Stereotactic Radiosurgery (SRS) sparing normal tissues.',
        restoringMobilityTitle: 'Sub-Millimeter Tumor Destruction',
        restoringMobilityText: 'Real-time respiratory gating targets tumors in motion while protecting adjacent healthy organs like the heart and lungs.',
        imageType: 'cancer',
        accordions: [
          {
            title: 'Stereotactic Body Radiotherapy (SBRT)',
            content: 'Delivers high ablation radiation doses in 3-5 sessions for inoperable tumors.'
          }
        ]
      }
    ]
  }
];

export const KEY_SPECIALTIES_DATA = [
  { name: 'Neurology', dept: 'Neurology', desc: 'Comprehensive care for stroke, epilepsy, Parkinson’s, multiple sclerosis, and neuromuscular disorders.' },
  { name: 'Pulmonology', dept: 'Pulmonology', desc: 'Asthma, COPD, sleep apnea, interstitial lung disease, interventional bronchoscopy, and lung transplant.' },
  { name: 'Pediatrics', dept: 'Pediatrics', desc: 'Neonatal ICU, pediatric emergency, growth disorders, pediatric infections, and surgical interventions.' },
  { name: 'Obstetrics & Gynecology', dept: 'Obstetrics & Gynecology', desc: 'High-risk obstetrics, painless labor, laparoscopic hysterectomy, and reproductive endocrinology.' },
  { name: 'Dermatology', dept: 'Dermatology', desc: 'Clinical dermatology, psoriasis management, vitiligo surgery, allergy testing, and aesthetic therapies.' },
  { name: 'Ophthalmology', dept: 'Ophthalmology', desc: 'Cataract phacoemulsification, retinal detachment, glaucoma management, and corneal transplants.' },
  { name: 'ENT', dept: 'ENT', desc: 'Endoscopic sinus surgery, cochlear implants, voice clinic, and micro-ear reconstructive surgery.' },
  { name: 'Psychiatry', dept: 'Psychiatry', desc: 'Cognitive behavioral therapy, depression, anxiety, addiction rehabilitation, and neuropsychiatry.' },
  { name: 'Dentistry', dept: 'Dentistry', desc: 'Maxillofacial trauma, dental implants, orthodontics, periodontics, and aesthetic smile designs.' },
  { name: 'Endocrinology', dept: 'Endocrinology', desc: 'Diabetes care, thyroid disorders, pituitary diseases, metabolic bone disorders, and obesity clinics.' },
  { name: 'Hematology', dept: 'Hematology', desc: 'Blood disorders, leukemia, lymphoma, myeloma, aplastic anemia, and Bone Marrow Transplant (BMT).' },
  { name: 'Infectious Diseases', dept: 'Infectious Diseases', desc: 'Tropical fevers, multi-drug resistant infections, HIV care, travel medicine, and infection control.' },
  { name: 'Emergency Medicine', dept: 'Emergency Medicine', desc: '24/7 Level-1 trauma, acute stroke and heart attack pathways, emergency resuscitations.' },
  { name: 'General Surgery', dept: 'General Surgery', desc: 'Laparoscopic appendix, gallbladder, hernia repairs, diabetic foot care, and wound management.' }
];
