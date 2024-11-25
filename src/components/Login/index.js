import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitErr: false, errorMsg: ''}

  validateInputs = () => {
    const {username, password} = this.state

    if (username === '') {
      this.setState({errorMsg: 'Username is required', showErrorMsg: true})
      return false
    }
    if (password === '') {
      this.setState({errorMsg: 'Password is required', showErrorMsg: true})
      return false
    }
    return true
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitErr: true, errorMsg})
  }

  onSubmitUserDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()

    console.log(data)
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_message)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showSubmitErr, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form
          className="login-container-box"
          onSubmit={this.onSubmitUserDetails}
        >
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-logo"
          />
          <label htmlFor="username">USERNAME</label>
          <input
            className="input-username"
            id="username"
            type="text"
            placeholder="Username"
            onChange={this.onChangeUsername}
            value={username}
          />
          <br />
          <label htmlFor="password">PASSWORD</label>
          <input
            className="input-username"
            id="password"
            type="password"
            placeholder="Password"
            onChange={this.onChangePassword}
            value={password}
          />
          <button type="submit" className="login-btn">
            Login
          </button>
          {showSubmitErr && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
