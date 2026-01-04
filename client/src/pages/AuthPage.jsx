import { useSearchParams } from 'react-router-dom'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'login'

  return (
    <div>
      {mode === 'signup' ? <Signup /> : <Login />}
    </div>
  )
}
