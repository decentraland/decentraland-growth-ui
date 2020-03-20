import { useState, useEffect } from 'react'
import SingletonListener from '../utils/SingletonListener'

export default function useLocation() {
  const [location, setLocation] = useState<URL | null>(null)

  useEffect(() => {
    const listener = SingletonListener.from(window)
    const changeLocation = () => setLocation(new URL(window.location.toString()))

    listener.addEventListener('hashchange' as any, changeLocation)
    listener.addEventListener('popstate' as any, changeLocation)
    changeLocation()

    return () => {
      listener.removeEventListener('hashchange' as any, changeLocation)
      listener.removeEventListener('popstate' as any, changeLocation)
    }
  }, [])

  return location
}