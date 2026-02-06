import { AuthResponse, LoginCredentials, User } from '../types';

// Mock auth service - simulates API calls
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'admin@insurecorp.com',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    role: 'admin',
    phone: '555-0101',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    email: 'agent@insurecorp.com',
    password: 'agent123',
    firstName: 'James',
    lastName: 'Wilson',
    role: 'agent',
    phone: '555-0102',
    createdAt: '2024-03-20T08:00:00Z',
  },
  {
    id: '3',
    email: 'customer@example.com',
    password: 'customer123',
    firstName: 'Emily',
    lastName: 'Chen',
    role: 'customer',
    phone: '555-0103',
    customerId: 'CUST-001',
    createdAt: '2024-06-10T08:00:00Z',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800);
    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    const token = btoa(
      JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }),
    );
    return { user: userWithoutPassword, token };
  },

  async getCurrentUser(token: string): Promise<User> {
    await delay(300);
    try {
      const decoded = JSON.parse(atob(token));
      const user = MOCK_USERS.find((u) => u.id === decoded.userId);
      if (!user) throw new Error('User not found');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      throw new Error('Invalid token');
    }
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },
};
