import { getCurrentUser } from '../../lib/auth.js';
import { RightRailClient } from './RightRailClient.js';

export async function RightRail() {
  const user = await getCurrentUser();
  
  return (
    <RightRailClient 
      user={user ? {
        name: user.name,
        email: user.email,
        role: user.role
      } : null}
    />
  );
}
