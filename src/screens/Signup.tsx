import React, { useCallback, useState } from 'react'
import FacebookLogin from 'react-facebook-login'

import { useAuth } from '../store'
import { EMAIL_REGEX } from '../const'
import { useHistory } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faCheck,
  faEnvelope,
  faLandmark,
  faLock,
} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [disable, setDisable] = useState(false)

  // const [modalActive, setModalActive] = useState(false)
  const [errors, setError] = useState({
    email: '',
    password1: '',
    password2: '',
    username: '',
  })
  const auth = useAuth()

  const isValid = useCallback(() => {
    let checkPassed = true
    let newError = {
      email: '',
      password1: '',
      password2: '',
      username: '',
    }
    if (!EMAIL_REGEX.test(email)) {
      newError.email = 'Email is invalid'
    }
    if (password1.length < 8) {
      newError.password1 = 'Password must not be less than 8 characters long'
      checkPassed = false
    }
    if (username.length < 4) {
      newError.username = 'Username must not be less than 4 characters long'
      checkPassed = false
    }
    if (!username) {
      newError.username = 'Username is required'
      checkPassed = false
    }
    if (!email) {
      newError.email = 'Email is required'
      checkPassed = false
    }
    if (!password1) {
      newError.password1 = 'Password is required'
      checkPassed = false
    }
    if (!password2) {
      newError.password2 = 'Password Confirmation is required'
      checkPassed = false
    }

    if (!checkPassed) {
      setError({ ...newError })
    }
    return checkPassed
  }, [username, email, password1, password2])

  const history = useHistory()

  let componentClick = () => {
    console.log('clicked')
  }

  return (
    <div className='form-box'>
      <div className='form-right'>
        <div className='form-divider box'>
          <form
            className='form'
            onSubmit={async (e) => {
              e.preventDefault()
              setDisable(true)
              try {
                if (auth && isValid()) {
                  await auth.actions.signup({
                    username,
                    email,
                    password1,
                    password2,
                  })
                }
                if (!auth?.error.signup) {
                  history.push('/login/')
                }
              } catch (err) {
                if (axios.isAxiosError(err)) {
                  let data = err.response?.data
                  if ('non_field_errors' in data) {
                    setError(data['non_field_errors'][0])
                  }
                }
              }
              setDisable(false)
            }}
          >
            <legend className='legend'>Signup</legend>
            <div className='field'>
              <p className='control has-icons-left'>
                <input
                  className='input'
                  type='text'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                  }}
                  placeholder='Username'
                  disabled={disable}
                />
                <span className='icon is-small is-left'>
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </p>
              {errors.username && (
                <p className='help is-danger'>{errors.username}</p>
              )}
            </div>
            <div className='field'>
              <p className='control has-icons-left has-icons-right'>
                <input
                  className='input'
                  type='email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  placeholder='Email'
                  disabled={disable}
                />
                <span className='icon is-small is-left'>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <span className='icon is-small is-right'>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                {errors.email && (
                  <p className='help is-danger'>{errors.email}</p>
                )}
              </p>
            </div>
            <div className='field'>
              <p className='control has-icons-left'>
                <input
                  className='input'
                  type='password'
                  value={password1}
                  onChange={(e) => {
                    setPassword1(e.target.value)
                  }}
                  placeholder='Password'
                  disabled={disable}
                />
                <span className='icon is-small is-left'>
                  <FontAwesomeIcon icon={faLock} />
                </span>
                {errors.password1 && (
                  <p className='help is-danger'>{errors.password1}</p>
                )}
              </p>
            </div>
            <div className='field'>
              <p className='control has-icons-left'>
                <input
                  className='input'
                  type='password'
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value)
                  }}
                  placeholder='Confirm Password'
                  disabled={disable}
                />
                <span className='icon is-small is-left'>
                  <FontAwesomeIcon icon={faLock} />
                </span>
                {errors.password2 && (
                  <p className='help is-danger'>{errors.password2}</p>
                )}
              </p>
            </div>
            {auth?.error.signup.authentication && (
              <p className='lg err'>{auth.error.signup.authentication}</p>
            )}
            <div className='field'>
              <p className='control'>
                <button
                  type='submit'
                  className={`button sm is-info ${disable && 'is-loading'}`}
                  disabled={disable}
                  id='signupbtn'
                  style={{ width: '100%' }}
                >
                  SIGNUP
                </button>
              </p>
            </div>
            <FacebookLogin
              appId='3735839843193335'
              fields='name,email'
              onClick={componentClick}
              callback={(res: any) => {
                setUsername(res.name.replace(/\s+/g, '').trim())
                setEmail(res.email)
                setPassword1(res.userID)
                setPassword2(res.userID)
                document.getElementById('signupbtn')?.click()
              }}
              cssClass='is-facebook'
            />
            {/* <div className={`${modalActive && 'is-active'} modal`}>
            <div className='modal-background'></div>
            <div
              className='modal-content'
              style={{
                textAlign: 'center',
                backgroundColor: '#444',
                padding: '30px',
                borderRadius: '5px',
              }}
            >
              <p style={{ color: '#fff', paddingBottom: '5px' }}>
                Select who you are on Instagram and using this website as?
              </p>
              <div className='select is-medium'>
                <select
                  value={userType}
                  onChange={(e) => {
                    setUserType(e.target.value)
                  }}
                >
                  <option>----------</option>
                  <option>Influencer</option>
                  <option>Consumer</option>
                </select>
              </div>
              <div className='btns' style={{ padding: '10px' }}>
                <button
                  type='submit'
                  className='button is-primary'
                  style={{ margin: '0 5px' }}
                >
                  Submit
                </button>
                <button
                  type='button'
                  style={{ margin: '0 5px' }}
                  onClick={() => {
                    setModalActive(false)
                  }}
                  className='button is-danger'
                >
                  Cancel
                </button>
              </div>
            </div>
            <button
              className='modal-close is-large'
              aria-label='close'
              onClick={() => {
                setModalActive(false)
              }}
            ></button>
          </div> */}
            {/* <div className="field">
              <p className="control">
                <button
                  type="button"
                  className="button is-instagram"
                  style={{ width: "100%" }}
                >
                  <span>Signup With Facebook</span>
                  <i className="fab fa-lg fa-facebook"></i>
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

export default Signup
