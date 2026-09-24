import { getUser } from '@/lib/auth/getUser';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
  const user = await getUser();

  // Extra layer of security: if no user is found, kick them to login
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-2">Manage your personal details and delivery addresses.</p>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}
