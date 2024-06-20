import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showSubmitError: false,
  }

  usernameIntake = event => {
    console.log(event.target.value)
    this.setState({username: event.target.value})
  }

  passwordIntake = event => {
    console.log(event.target.value)
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    console.log(jwtToken)
    console.log(this.props)
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    history.replace('/')
  }

  submitCredentials = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const options = {
      method: 'POST',
      body: JSON.stringify({username, password}),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    }
    if (!response.ok) {
      this.setState({errorMsg: data.error_msg, showSubmitError: true})
    }
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page">
        <form onSubmit={this.submitCredentials} className="login-form">
          <img
            className="logo-at-login-page"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />

          <div>
            <label htmlFor="usernameinput" className="username-password-label">
              USERNAME
            </label>
            <br />

            <input
              id="usernameinput"
              type="text"
              placeholder="Username"
              className="username-password-input-field"
              onChange={this.usernameIntake}
            />
          </div>
          <div>
            <label className="username-password-label" htmlFor="passwordinput">
              PASSWORD
            </label>
            <br />

            <input
              id="passwordinput"
              placeholder="Password"
              type="password"
              className="username-password-input-field"
              onChange={this.passwordIntake}
            />
          </div>
          <div>
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
