#!/usr/bin/env node
import { randomBytes } from 'crypto';

const secret = randomBytes(32).toString('hex');
console.log('Generated NEXTAUTH_SECRET:');
console.log('');
console.log(`NEXTAUTH_SECRET=${secret}`);
console.log('');
console.log('Copy the line above into your .env.local file');
