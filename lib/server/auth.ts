import { query } from '../db';
import { User, UserRole } from '@/types';

// Helper function to convert database row to User object
const mapRowToUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role as UserRole,
  department: row.department,
  companyId: row.company_id,
  avatar: row.avatar
});

export const authenticate = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    
    // For demo purposes, we'll accept any password that equals "password123"
    // In production, you would hash the password and compare with stored hash
    if (password === 'password123') {
      return mapRowToUser(user);
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};