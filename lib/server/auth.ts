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
  console.log('🔍 Auth: authenticate function called with email:', email);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    console.log('📡 Auth: Querying database for user...');
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    console.log('📡 Auth: Database query result:', {
      rowCount: result.rows.length,
      foundUser: result.rows.length > 0 ? result.rows[0].email : 'none'
    });
    
    if (result.rows.length === 0) {
      console.log('❌ Auth: No user found with email:', email);
      return null;
    }
    
    const user = result.rows[0];
    console.log('👤 Auth: User found:', { id: user.id, email: user.email, role: user.role });
    
    // For demo purposes, we'll accept any password that equals "password123"
    // In production, you would hash the password and compare with stored hash
    if (password === 'password123') {
      console.log('✅ Auth: Password correct, returning user');
      const mappedUser = mapRowToUser(user);
      console.log('👤 Auth: Mapped user:', mappedUser);
      return mappedUser;
    } else {
      console.log('❌ Auth: Password incorrect');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Auth: Database error:', error);
    return null;
  }
};