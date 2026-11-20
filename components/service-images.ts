import type { StaticImageData } from 'next/image';
import type { ServiceImageKey } from '@/lib/clinic-data';

import examDiagnosisImg from '@/src/assets/images/male_exam_diagnosis_1795203941070.jpg';
import cleaningPolishingImg from '@/src/assets/images/male_cleaning_polishing_1795203941245.jpg';
import teethWhiteningImg from '@/src/assets/images/service_teeth_whitening_1795203188167.jpg';
import dentalFillingsImg from '@/src/assets/images/service_dental_fillings_1795203189132.jpg';
import cosmeticFillingsImg from '@/src/assets/images/service_cosmetic_fillings_1795203188765.jpg';
import dentalVeneersImg from '@/src/assets/images/service_dental_veneers_1795203188936.jpg';
import rootCanalImg from '@/src/assets/images/service_root_canal_1795203188646.jpg';
import orthodonticsImg from '@/src/assets/images/service_orthodontics_1795203188588.jpg';
import dentalImplantsImg from '@/src/assets/images/service_dental_implants_1795203188581.jpg';
import prostheticsCrownsImg from '@/src/assets/images/service_prosthetics_crowns_1795203188940.jpg';
import cosmeticDentistryImg from '@/src/assets/images/male_cosmetic_dentistry_1795203940845.jpg';
import dentalExtractionsImg from '@/src/assets/images/service_dental_extractions_1795203188463.jpg';

export const SERVICE_IMAGES: Record<ServiceImageKey, StaticImageData> = {
  'exam-diagnosis': examDiagnosisImg,
  'cleaning-polishing': cleaningPolishingImg,
  'teeth-whitening': teethWhiteningImg,
  'dental-fillings': dentalFillingsImg,
  'cosmetic-fillings': cosmeticFillingsImg,
  'dental-veneers': dentalVeneersImg,
  'root-canal': rootCanalImg,
  orthodontics: orthodonticsImg,
  'dental-implants': dentalImplantsImg,
  'prosthetics-crowns': prostheticsCrownsImg,
  'cosmetic-dentistry': cosmeticDentistryImg,
  'dental-extractions': dentalExtractionsImg,
};
