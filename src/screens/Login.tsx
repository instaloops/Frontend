import React, { useState } from 'react'
import { useHistory } from 'react-router'
import FacebookLogin from 'react-facebook-login'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCheck, faLock } from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../store'
import axios from 'axios'
import { Link } from 'react-router-dom'

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [error, setError] = useState('')

  const [disable, setDisable] = useState(false)

  const auth = useAuth()
  const history = useHistory()

  return (
    <div className='form-box'>
      <div className='form-right'>
        <div className='form-divider box'>
          <form
            className='form'
            onSubmit={async (e) => {
              e.preventDefault()
              setDisable(true)
              let isSuccess = false
              if (auth) {
                isSuccess = await auth?.actions.login({ email, password })
              }
              if (isSuccess) {
                history.push('/')
              }
              // } catch (err) {
              //   if (axios.isAxiosError(err)) {
              //     let data = err.response?.data;
              //     if ("non_field_errors" in data) {
              //       setError(data["non_field_errors"][0]);
              //     }
              //   }
              // }
              setDisable(false)
            }}
          >
            <legend className='legend'>Login</legend>
            <div className='field'>
              <p className='control has-icons-left has-icons-right'>
                <input
                  className='input'
                  name='auth_email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  type='email'
                  placeholder='Email'
                  disabled={disable}
                />
                <span className='icon is-small is-left'>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <span className='icon is-small is-right'>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
              </p>
            </div>
            <div className='field'>
              <p className='control has-icons-left'>
                <input
                  className='input'
                  type='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  name='auth_password'
                  placeholder='Password'
                  disabled={disable}
                />
                <span className='icon is-small is-left'>
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </p>
            </div>
            {auth.error.login.authentication && (
              <p className='lg err'>{auth.error.login.authentication}</p>
            )}
            <div className="reset-password-btn">
              <Link to="/reset-password/">Forgot password?</Link>
            </div>
            <div className='field'>
              <p className='control'>
                <button
                  type='submit'
                  className={`button sm is-info ${disable && 'is-loading'}`}
                  disabled={disable}
                  id='login-btn'
                  style={{ width: '100%' }}
                >
                  LOGIN
                </button>
              </p>
            </div>
            <FacebookLogin
              appId='3735839843193335'
              fields='name,email'
              onClick={() => {
                console.log('clicked')
              }}
              callback={(res: any) => {
                setEmail(res.email)
                setPassword(res.userID)
                document.getElementById('login-btn')?.click()
              }}
              cssClass='is-facebook'
            />

            {/* <div className="field">
              <p className="control">
                <button className=" is-instagram" style={{ width: "100%" }}>
                  <span>Login With Instagram</span>
                  <i className="fab fa-lg fa-instagram"></i>
                  <div style={{ marginRight: "auto" }}></div>
                </button>
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
