import { getAllUsers } from '@/lib/actions/users';
import UserRoleTable from './UserRoleTable';

export const metadata = {
  title: 'Manage Users - Admin Dashboard',
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          View all registered customers and assign admin privileges to your staff.
        </p>
      </div>

      <UserRoleTable users={users} />
    </div>
  );
}
