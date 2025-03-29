// Standard vaccination schedule based on CDC recommendations
export interface VaccineScheduleItem {
  id: string;
  name: string;
  fullName: string;
  description: string;
  ageMonths: number; // Age in months when the vaccine should be administered
  doses: VaccineDose[];
}

export interface VaccineDose {
  doseNumber: number;
  ageMonths: number;
}

export const vaccineSchedule: VaccineScheduleItem[] = [
  {
    id: "hepb",
    name: "HepB",
    fullName: "Hepatitis B",
    description: "Protects against hepatitis B, a serious liver disease.",
    ageMonths: 0,
    doses: [
      { doseNumber: 1, ageMonths: 0 }, // Birth
      { doseNumber: 2, ageMonths: 1 }, // 1-2 months
      { doseNumber: 3, ageMonths: 6 }, // 6-18 months
    ],
  },
  {
    id: "rotavirus",
    name: "RV",
    fullName: "Rotavirus",
    description: "Protects against rotavirus, which causes severe diarrhea and dehydration.",
    ageMonths: 2,
    doses: [
      { doseNumber: 1, ageMonths: 2 },
      { doseNumber: 2, ageMonths: 4 },
      { doseNumber: 3, ageMonths: 6 }, // For RotaTeq (RV5)
    ],
  },
  {
    id: "dtap",
    name: "DTaP",
    fullName: "Diphtheria, Tetanus, & acellular Pertussis",
    description: "Protects against diphtheria, tetanus, and pertussis (whooping cough).",
    ageMonths: 2,
    doses: [
      { doseNumber: 1, ageMonths: 2 },
      { doseNumber: 2, ageMonths: 4 },
      { doseNumber: 3, ageMonths: 6 },
      { doseNumber: 4, ageMonths: 15 }, // 15-18 months
      { doseNumber: 5, ageMonths: 48 }, // 4-6 years (48-72 months)
    ],
  },
  {
    id: "hib",
    name: "Hib",
    fullName: "Haemophilus influenzae type b",
    description: "Protects against Haemophilus influenzae type b, which can cause meningitis and other serious infections.",
    ageMonths: 2,
    doses: [
      { doseNumber: 1, ageMonths: 2 },
      { doseNumber: 2, ageMonths: 4 },
      { doseNumber: 3, ageMonths: 6 }, // Depending on brand
      { doseNumber: 4, ageMonths: 12 }, // 12-15 months
    ],
  },
  {
    id: "pcv13",
    name: "PCV13",
    fullName: "Pneumococcal conjugate",
    description: "Protects against pneumococcal disease, which can cause ear infections, pneumonia, and meningitis.",
    ageMonths: 2,
    doses: [
      { doseNumber: 1, ageMonths: 2 },
      { doseNumber: 2, ageMonths: 4 },
      { doseNumber: 3, ageMonths: 6 },
      { doseNumber: 4, ageMonths: 12 }, // 12-15 months
    ],
  },
  {
    id: "ipv",
    name: "IPV",
    fullName: "Inactivated Poliovirus",
    description: "Protects against polio, a disease that can cause paralysis.",
    ageMonths: 2,
    doses: [
      { doseNumber: 1, ageMonths: 2 },
      { doseNumber: 2, ageMonths: 4 },
      { doseNumber: 3, ageMonths: 6 }, // 6-18 months
      { doseNumber: 4, ageMonths: 48 }, // 4-6 years (48-72 months)
    ],
  },
  {
    id: "influenza",
    name: "Flu",
    fullName: "Influenza",
    description: "Protects against seasonal influenza (flu). Recommended annually.",
    ageMonths: 6,
    doses: [
      { doseNumber: 1, ageMonths: 6 }, // First dose at 6 months, then annually
    ],
  },
  {
    id: "mmr",
    name: "MMR",
    fullName: "Measles, Mumps, & Rubella",
    description: "Protects against measles, mumps, and rubella.",
    ageMonths: 12,
    doses: [
      { doseNumber: 1, ageMonths: 12 }, // 12-15 months
      { doseNumber: 2, ageMonths: 48 }, // 4-6 years (48-72 months)
    ],
  },
  {
    id: "varicella",
    name: "Varicella",
    fullName: "Chickenpox",
    description: "Protects against chickenpox.",
    ageMonths: 12,
    doses: [
      { doseNumber: 1, ageMonths: 12 }, // 12-15 months
      { doseNumber: 2, ageMonths: 48 }, // 4-6 years (48-72 months)
    ],
  },
  {
    id: "hepa",
    name: "HepA",
    fullName: "Hepatitis A",
    description: "Protects against hepatitis A, a liver disease.",
    ageMonths: 12,
    doses: [
      { doseNumber: 1, ageMonths: 12 }, // 12-23 months
      { doseNumber: 2, ageMonths: 18 }, // 6 months after first dose
    ],
  },
];

/**
 * Generates a vaccination schedule for a child based on their birth date
 * @param birthDate Child's birth date
 * @returns Array of recommended vaccinations with scheduled dates
 */
export function generateVaccinationSchedule(birthDate: Date): {
  name: string;
  fullName: string;
  doseNumber: number;
  scheduledDate: Date;
  description: string;
}[] {
  const vaccinations = [];
  
  for (const vaccine of vaccineSchedule) {
    for (const dose of vaccine.doses) {
      const scheduledDate = new Date(birthDate);
      scheduledDate.setMonth(scheduledDate.getMonth() + dose.ageMonths);
      
      vaccinations.push({
        name: `${vaccine.name} ${getDoseOrdinal(dose.doseNumber)}`,
        fullName: `${vaccine.fullName} ${getDoseOrdinal(dose.doseNumber)}`,
        doseNumber: dose.doseNumber,
        scheduledDate,
        description: vaccine.description,
      });
    }
  }
  
  // Sort by scheduled date
  return vaccinations.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
}

/**
 * Get the ordinal suffix for a dose number (1st, 2nd, 3rd, etc.)
 */
function getDoseOrdinal(doseNumber: number): string {
  if (doseNumber === 1) return "1st dose";
  if (doseNumber === 2) return "2nd dose";
  if (doseNumber === 3) return "3rd dose";
  return `${doseNumber}th dose`;
}

/**
 * Calculate vaccination progress for a child based on completed vaccinations
 * @param birthDate Child's birth date (to determine which vaccines should be considered)
 * @param completedVaccinations Array of completed vaccination names
 * @returns Progress percentage (0-100)
 */
export function calculateVaccinationProgress(birthDate: Date, completedVaccinations: string[] = []): number {
  const ageInMonths = calculateAgeInMonths(birthDate);
  
  // Count the total number of doses that should have been administered by now
  let totalDoses = 0;
  let completedDoses = 0;
  
  for (const vaccine of vaccineSchedule) {
    for (const dose of vaccine.doses) {
      if (dose.ageMonths <= ageInMonths) {
        totalDoses++;
        
        // Check if this dose is in the completed list
        const doseName = `${vaccine.name} ${getDoseOrdinal(dose.doseNumber)}`;
        if (completedVaccinations.includes(doseName)) {
          completedDoses++;
        }
      }
    }
  }
  
  if (totalDoses === 0) return 100; // No vaccines due yet
  
  return Math.round((completedDoses / totalDoses) * 100);
}

/**
 * Calculate a child's age in months
 */
function calculateAgeInMonths(birthDate: Date): number {
  const today = new Date();
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  
  return years * 12 + months;
}

/**
 * Vaccine information categories for educational content
 */
export const vaccineInfoCategories = [
  {
    title: "Infant Vaccines (0-12 months)",
    description: "Essential vaccines for newborns and infants.",
    vaccines: vaccineSchedule.filter(v => v.ageMonths < 12),
  },
  {
    title: "Toddler Vaccines (1-3 years)",
    description: "Important follow-up and booster vaccines.",
    vaccines: vaccineSchedule.filter(v => v.ageMonths >= 12 && v.ageMonths < 36),
  },
  {
    title: "School-Age Vaccines (4+ years)",
    description: "Vaccines required before starting school.",
    vaccines: vaccineSchedule.filter(v => v.ageMonths >= 48),
  },
];
