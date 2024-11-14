import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
  return (
    <div className='pt-20 bg-black justify-center'>
  <UserProfile />
  </div>

);
}