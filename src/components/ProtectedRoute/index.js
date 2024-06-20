import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const token = Cookies.get('jwt_token')
  console.log(props)
  console.log('*********')
  console.log(token)
  if (token === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute
