export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  district: string;
  rating: number;
  reviews: number;
  image: string;
  isAvailable: boolean;
  fees: number;
  experience: string;
  description: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorId: string;
  time: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  clinicLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  contact: string;
}

export const DISTRICTS = [
  "Srinagar", "Baramulla", "Anantnag", "Pulwama", "Kupwara", "Shopian", "Ganderbal", "Bandipora", "Budgam", "Kulgam"
];

export const SPECIALIZATIONS = [
  "Cardiology", "Pediatrics", "Dermatology", "Orthopedics", "General Physician", "Neurology", "Gynecology"
];

const NAMES = [
  "Dr. Aadil Ohian", "Dr. Zara Shah", "Dr. Bilal Khan", "Dr. Fatima Mir", "Dr. Ishfaq Wani",
  "Dr. Saniya Zehra", "Dr. Omar Abdullah", "Dr. Mehvish Qadri", "Dr. Junaid Matoo", "Dr. Hina Bhat"
];

const DESCRIPTIONS = [
  "Specialist in complex cases with a focus on preventive care.",
  "Renowned for a patient-centric approach and minimally invasive treatments.",
  "Expert in pediatric care with over 15 years of hospital experience.",
  "Dedicated to providing comprehensive care for chronic conditions.",
  "Award-winning specialist known for accurate diagnosis and effective treatment plans.",
  "Combines modern medical practices with holistic wellness strategies.",
  "Highly rated for bedside manner and detailed patient consultations.",
  "Specializes in advanced surgical procedures with a high success rate."
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const generateMockDoctors = (count: number = 200): Doctor[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `doc_${i + 1}`,
    name: `${randomItem(NAMES)}`, // In real app, avoid duplicates or use more names
    specialization: randomItem(SPECIALIZATIONS),
    district: randomItem(DISTRICTS),
    rating: parseFloat((randomInt(35, 50) / 10).toFixed(1)),
    reviews: randomInt(10, 500),
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    isAvailable: Math.random() > 0.7,
    fees: randomInt(300, 1500),
    experience: `${randomInt(2, 25)} years`,
    description: randomItem(DESCRIPTIONS)
  }));
};

export const MOCK_DOCTORS = generateMockDoctors(200);

export const generateMockAppointments = (doctors: Doctor[], count: number = 50): Appointment[] => {
  return Array.from({ length: count }).map((_, i) => {
    const doctor = randomItem(doctors);
    const date = new Date();
    date.setDate(date.getDate() + randomInt(-5, 14));

    return {
      id: `app_${i + 1}`,
      patientName: `Patient ${randomInt(100, 999)}`,
      patientId: `pat_${randomInt(1, 100)}`,
      doctorId: doctor.id,
      time: `${randomInt(9, 17)}:00 ${randomInt(0, 1) ? 'AM' : 'PM'}`,
      date: date.toISOString().split('T')[0],
      status: randomItem(['pending', 'confirmed', 'completed'] as const),
      clinicLocation: {
        lat: 34.0837,
        lng: 74.7973,
        address: `${doctor.district} General Clinic, Block ${randomInt(1, 10)}`
      },
      contact: `+91 ${randomInt(600, 999)}${randomInt(100000, 999999)}`
    };
  });
};

export const MOCK_APPOINTMENTS = generateMockAppointments(MOCK_DOCTORS, 50);
