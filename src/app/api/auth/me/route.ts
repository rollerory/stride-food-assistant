import { createClient } from '@/lib/supabase/client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
type AuthTokenPayload = jwt.JwtPayload & { userId: number | string; username: string };

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { message: 'Token not found' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Перевірити токен
    let decoded: AuthTokenPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    } catch {
      return Response.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const supabase = createClient();

    // Отримати користувача з БД
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(user);
  } catch (error: unknown) {
    console.error('Auth check error:', error);
    return Response.json(
      { message: 'Error occurred during authentication check' },
      { status: 500 }
    );
  }
}
