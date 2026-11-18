import {
  BookingRecord,
  formatBookingReference,
  getUpcomingWorkingDays,
} from './booking-logic';

function createInitialSeedBookings(): BookingRecord[] {
  const days = getUpcomingWorkingDays(3);
  const firstDay = days[0]?.date ?? '2026-11-18';
  const secondDay = days[1]?.date ?? '2026-11-19';

  return [
    {
      id: 'seed-1',
      referenceCode: 'NV-410281',
      branchId: 'fifth-settlement',
      serviceId: 'veneers-dsd',
      doctorId: 'dr-amira',
      date: firstDay,
      time: '14:00',
      patientName: 'مريم عادل',
      patientPhone: '01001122334',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      referenceCode: 'NV-410282',
      branchId: 'fifth-settlement',
      serviceId: 'immediate-implants',
      doctorId: 'dr-ahmed',
      date: secondDay,
      time: '17:00',
      patientName: 'كريم وجدي',
      patientPhone: '01112233445',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];
}

const globalStore = globalThis as typeof globalThis & {
  __nouveBookingsStore?: BookingRecord[];
};

export function getServerBookings(): BookingRecord[] {
  if (!globalStore.__nouveBookingsStore) {
    globalStore.__nouveBookingsStore = createInitialSeedBookings();
  }
  return globalStore.__nouveBookingsStore;
}

export function addServerBooking(
  payload: Omit<BookingRecord, 'id' | 'referenceCode' | 'status' | 'createdAt'>
): BookingRecord {
  const store = getServerBookings();
  const record: BookingRecord = {
    ...payload,
    id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    referenceCode: formatBookingReference(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  store.unshift(record);
  return record;
}

export function cancelServerBooking(idOrRef: string): BookingRecord | null {
  const store = getServerBookings();
  const target = store.find(
    (item) => item.id === idOrRef || item.referenceCode === idOrRef
  );
  if (!target) return null;
  target.status = 'cancelled';
  return target;
}
