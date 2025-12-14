import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { db, sql } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        logger.error('Error verifying password:', e);
        throw new Error('Password verification failed');
    }
};

export const authenticateUser = async ({ email, password }) => {
    try {
        const [existingUser] = await sql`
            SELECT id, name, email, password, role 
            FROM users 
            WHERE email = ${email} 
            LIMIT 1
        `;
        if (!existingUser) {
            throw new Error('User not found');
        }
        const isPasswordValid = await comparePassword(password, existingUser.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        logger.info(`User ${email} authenticated successfully`);
        return { 
            id: existingUser.id, 
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            created_at: existingUser.created_at
        };
    } catch (e) {
        logger.error(`Authentication error for ${email}:`, e.message);
        throw e;
    }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        logger.info(`Attempting to create user with email: ${email}`);
        
        // Check if user exists using raw SQL
        try {
            const existingUsers = await sql`
                SELECT id FROM users WHERE email = ${email} LIMIT 1
            `;

            if (existingUsers.length > 0) {
                throw new Error('User with this email already exists');
            }
        } catch (dbError) {
            if (dbError.message === 'User with this email already exists') {
                throw dbError;
            }
            logger.error('Database query failed:', dbError.message);
            throw new Error(`Database error: ${dbError.message}`);
        }

        const password_hash = await hashPassword(password);

        // Insert user using raw SQL
        const result = await sql`
            INSERT INTO users (name, email, password, role)
            VALUES (${name}, ${email}, ${password_hash}, ${role})
            RETURNING id, name, email, role, created_at as "created_at"
        `;

        const newUser = result[0];

        logger.info(`User ${newUser.email} created successfully`);
        return newUser;
    } catch (e) {
        logger.error(`Error creating the user: ${e.message}`);
        throw e;
    }
};
