import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'لوحة إدارة الحجوزات | Admin',
  description: 'لوحة تحكم عيادة نوفا لطب الأسنان لإدارة حجوزات المرضى.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
