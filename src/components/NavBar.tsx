import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'

const NavBar = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'All Stories', path: '/stories' },
  ]

  const authPages = session ? [
    { name: 'Your Stories', path: `/stories/users/${session.user.id}` },
  ] : []

  return (
    <nav className="bg-[#2e026d] border-b border-white p-4 px-6">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          {pages.map((page) => (
            <button 
              key={page.name} 
              className="text-white text-2xl hover:text-blue-500 transition-colors"
              onClick={() => {void router.push(page.path)}}
            >
              {page.name}
            </button>
          ))}
        </div>
        <div className="flex space-x-4">
          {authPages.map((page) => (
            <button 
              key={page.name} 
              className="text-white text-2xl hover:text-blue-500 transition-colors"
              onClick={() => {void router.push(page.path)}}
            >
              {page.name}
            </button>
          ))}
          <button 
            className="text-white text-2xl hover:text-blue-500 transition-colors"
            onClick={() => {session ? void signOut() : void signIn()}}
          >
            {session ? 'Sign out' : 'Sign in'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar