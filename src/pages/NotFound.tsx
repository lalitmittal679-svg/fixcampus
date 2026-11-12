import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/common/Common'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="card w-full max-w-md">
        <EmptyState icon={Compass} title="Page not found" text="The page you are looking for does not exist or has moved." action={<Link to="/" className="btn-primary">Back to home</Link>} />
      </div>
    </div>
  )
}
