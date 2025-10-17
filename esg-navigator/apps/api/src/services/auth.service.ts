import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
  organization: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Mock user database (replace with real database in production)
const users: Map<string, User & { password: string }> = new Map([
  ['admin@tisholdings.co.za', {
    id: '1',
    email: 'admin@tisholdings.co.za',
    password: '$2a$10$X8qZ9YvKZO5GxvYJ9YvKZOhGxvYJ9YvKZOhGxvYJ9YvKZO', // hashed: "admin123"
    name: 'Terry Rapley',
    role: 'admin',
    organization: 'TIS Holdings',
    createdAt: new Date().toISOString()
  }],
  ['analyst@tisholdings.co.za', {
    id: '2',
    email: 'analyst@tisholdings.co.za',
    password: '$2a$10$Y9zABwLZP6HywZK0AwLZP6HywZK0AwLZP6HywZK0AwLZ', // hashed: "analyst123"
    name: 'ESG Analyst',
    role: 'analyst',
    organization: 'TIS Holdings',
    createdAt: new Date().toISOString()
  }]
]);

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const userWithPassword = users.get(credentials.email);
    
    if (!userWithPassword) {
      throw new Error('Invalid credentials');
    }

    // In production, use bcrypt.compare
    // For demo, simplified check
    const isValidPassword = credentials.password === 'admin123' || credentials.password === 'analyst123';
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const { password, ...user } = userWithPassword;

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, user };
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    organization: string;
  }): Promise<{ token: string; user: User }> {
    if (users.has(userData.email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: 'viewer' as const,
      organization: userData.organization,
      createdAt: new Date().toISOString()
    };

    users.set(userData.email, newUser);

    const { password, ...user } = newUser;

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, user };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    for (const userWithPassword of users.values()) {
      if (userWithPassword.id === userId) {
        const { password, ...user } = userWithPassword;
        return user;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
