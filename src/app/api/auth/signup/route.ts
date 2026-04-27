import { createClient } from '@/lib/supabase/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return Response.json(
        { message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return Response.json(
        { message: 'Username can only contain letters, numbers, underscores, and hyphens' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Перевірити чи username вже існує
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return Response.json(
        { message: 'This username is already taken' },
        { status: 400 }
      );
    }

    // Хешувати пароль
    const password_hash = await bcryptjs.hash(password, 10);

    // Вставити користувача
    const { data: user, error } = await supabase
      .from('users')
      .insert({ username, password_hash })
      .select('id, username')
      .single();

    if (error) {
      return Response.json({ message: error.message }, { status: 400 });
    }

    // Створити JWT токен
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return Response.json({
      token,
      user,
    });
  } catch (error: unknown) {
    console.error('Signup error:', error);
    return Response.json(
      { message: 'Error occurred during signup' },
      { status: 500 }
    );
  }
}
