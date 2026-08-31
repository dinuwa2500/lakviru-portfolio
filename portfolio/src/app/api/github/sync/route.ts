import { NextResponse } from 'next/server';
import { syncGitHubProjects } from '@/lib/github';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  // Allow authenticated admin or secret authorization header
  const session = await getSession();
  const authHeader = request.headers.get('authorization');
  const secretKey = process.env.AUTH_SECRET;

  const isSecretValid = authHeader && secretKey && authHeader === `Bearer ${secretKey}`;
  const isAdminValid = session && session.role === 'ADMIN';

  if (!isSecretValid && !isAdminValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncGitHubProjects();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Sync failed' }, { status: 500 });
  }
}
