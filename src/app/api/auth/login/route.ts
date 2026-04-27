import { createClient } from '@/lib/supabase/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { message: 'Username та пароль обов\'язкові' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Отримати користувача за username
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('username', username)
      .single();

    if (error || !user) {
      return Response.json(
        { message: 'Неправильне ім\'я користувача або пароль' },
        { status: 401 }
      );
    }

    // Перевірити пароль
    const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return Response.json(
        { message: 'Неправильне ім\'я користувача або пароль' },
        { status: 401 }
      );
    }

    // Створити JWT токен
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return Response.json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return Response.json(
      { message: 'Помилка входу' },
      { status: 500 }
    );
  }
}
