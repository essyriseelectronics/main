'use client';

import { useState, useTransition } from 'react';
import { UserRecord, updateUserRole } from '@/lib/actions/users';
import { Shield, User as UserIcon, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function UserRoleTable({ users }: { users: UserRecord[] }) {
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleRoleChange = (userId: string, newRole: string) => {
    setMessage(null);
    setLoadingId(userId);

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'User role updated successfully.' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update role.' });
      }
      setLoadingId(null);
    });
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#0076c0]'
                      }`}>
                        {user.role === 'ADMIN' ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </div>
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {loadingId === user.id && <Loader2 className="w-4 h-4 text-[#0076c0] animate-spin" />}
                      <select
                        disabled={isPending}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#0076c0] focus:border-[#0076c0] block px-3 py-2 outline-none disabled:opacity-50"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
