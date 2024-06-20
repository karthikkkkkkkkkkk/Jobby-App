import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    history.replace('/login')
    Cookies.remove('jwt_token')
  }

  return (
    <nav className="header-nav">
      <Link to="/">
        <div>
          <img
            className="logo-image-on-website"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </div>
      </Link>
      <ul className="small-display-nav-icons-container">
        <Link to="/">
          <li>
            <AiFillHome className="nav-items-home-jobs-icon" />
          </li>
        </Link>
        <Link to="/jobs" className="nav-items-home-jobs-icon ">
          <li>
            <BsFillBriefcaseFill />
          </li>
        </Link>
        <li>
          <button
            type="button"
            onClick={onClickLogout}
            className="small-display-logout-button"
          >
            <FiLogOut />
          </button>
        </li>
      </ul>
      <ul className="large-display-nav-items">
        <li>
          <Link className="large-display-home-job-nav-item" to="/">
            Home
          </Link>
        </li>

        <li>
          <Link className="large-display-home-job-nav-item" to="/jobs">
            Jobs
          </Link>
        </li>
      </ul>
      <div className="large-display-logout-button-container">
        <button
          type="button"
          className="large-display-logout-button"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
