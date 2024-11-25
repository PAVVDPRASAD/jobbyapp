import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {FaSuitcase} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>
      <div className="icon-cont">
        <Link to="/">
          <AiFillHome className="icon-logo" />
        </Link>
        <Link to="/jobs">
          <FaSuitcase className="icon-logo" />
        </Link>
        <button
          aria-label="Submit Form"
          type="button"
          onClick={onClickLogout}
          className="logout-icon-btn"
        >
          <FiLogOut className="icon-logo" />
        </button>
      </div>
      <ul className="routes-container">
        <Link to="/">
          <li className="names">Home</li>
        </Link>
        <Link to="/jobs">
          <li className="names">Jobs</li>
        </Link>
      </ul>
      <button onClick={onClickLogout} type="button" className="logout-btn">
        Logout
      </button>
    </nav>
  )
}
export default withRouter(Header)
