import { NextRequest } from 'next/server';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export type CurrentUser = {
  id: string;
  email?: string;
  username?: string;
  role: 'user' | 'teacher' | 'admin';
  isAdmin: boolean;
};

export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || typeof payload.id !== 'string') return null;

  const user = await User.findById(payload.id).select('email username role isAdmin').lean();
  if (!user) return null;

  const dbRole = user.role === 'admin' || user.role === 'teacher' ? user.role : 'user';
  const isAdmin = user.isAdmin === true || dbRole === 'admin';

  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    role: isAdmin ? 'admin' : dbRole,
    isAdmin,
  };
}
