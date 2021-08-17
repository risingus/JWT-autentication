import { createContext, useEffect, useState } from "react"
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from "next/router";
import { api } from "../services/apiClient";



export const AuthContext = createContext({})

let authChannel;

export function signOut(){
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')
  authChannel.postMessage('signOut')
  Router.push('/')
}


export function AuthProvider({children}) {
  const [user, setUser] = useState()
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut': {
          signOut()
          break;
        }

        default: break;
      }
    }
  }, [])

  useEffect(() => {
    const {'nextauth.token': token} = parseCookies()

    if (token) {
      api.get('/me').then(response => {
        const {email, permissions, roles } = response.data
        setUser({email, permissions, roles})
      })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({email, password}) {
    try {
      const response = await api.post('sessions', {
        email, 
        password
      })

      const {permissions, roles, token, refreshToken} = response.data

      setUser({
        email,
        permissions,
        roles
      })

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (err) {
      console.log(err)
    }
    
  };

  return (
    <AuthContext.Provider value={{signIn, isAuthenticated, user, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}