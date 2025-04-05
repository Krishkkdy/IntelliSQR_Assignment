import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('Smitkkdy@11', 10);
    const user = await prisma.user.create({
      data: {
        email: 'krishkkdy@gmail.com',
        password: hashedPassword
      }
    });
    console.log('Test user created:', user);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();