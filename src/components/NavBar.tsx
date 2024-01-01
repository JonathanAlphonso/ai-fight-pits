import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'

const NavBar = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'All Stories', path: '/stories' },
  ]

  const authPages = session ? [
    { name: 'Your Stories', path: `/stories/users/${session.user.id}` },
    { name: 'Profile', path: '/users/profile' },

  ] : []

  return (
    <nav className="bg-[#2e026d] border-b border-white p-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="md:mb-4 md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <div className={`flex flex-col space-y-4 md:flex-row md:space-x-4 ${isMobileMenuOpen ? '' : 'hidden md:flex'}`}>
          {pages.map((page) => (
            <button 
              key={page.name} 
              className="mt-4 text-white text-2xl hover:text-blue-500 transition-colors"
              onClick={() => {void router.push(page.path)}}
            >
              {page.name}
            </button>
          ))}
        </div>
        <div className={`flex flex-col space-y-4 md:flex-row md:space-x-4 ${isMobileMenuOpen ? '' : 'hidden md:flex'}`}>
          {authPages.map((page) => (
            <button 
              key={page.name} 
              className="mt-4 text-white text-2xl hover:text-blue-500 transition-colors"
              onClick={() => {void router.push(page.path)}}
            >
              {page.name}
            </button>
          ))}
          <button 
            className="mt-4 text-white text-2xl hover:text-blue-500 transition-colors"
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