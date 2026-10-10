import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('canteengo_user') || 'null'))

  const login = (data) => {
    localStorage.setItem('canteengo_user', JSON.stringify(data))
    setUser(data)
  }
  const logout = () => {
    localStorage.removeItem('canteengo_user')
    setUser(null)
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
