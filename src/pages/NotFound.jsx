import { Link } from 'react-router-dom'
import { useTitle } from '../hooks/useCatalog'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="wrap page">
      <h1>This page is not in the shop.</h1>
      <Link className="btn btn-dark" to="/">
        Go home
      </Link>
    </div>
  )
}
