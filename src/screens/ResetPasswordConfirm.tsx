import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import axios from 'axios'

import { API_URL } from '../const'
import Spinner from '../components/Spinner'

interface ResetPasswordConfirmProps extends RouteComponentProps<{ token:string }> {}

const ResetPasswordConfirm: React.FC<ResetPasswordConfirmProps> = ({
  match,
}) => {
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [error, setError] = useState('')

  const history = useHistory()

  const token = match.params.token
  useEffect(() => {
    axios
      .get(`${API_URL}/check-token/?token=${token}`)
      .then((res) => {
        setIsTokenValid(true)
        setHasChecked(true)
        console.log(res.data)
      })
      .catch((err) => {
        setHasChecked(true)
        setIsTokenValid(false)
        console.log(err)
      })
  }, [token])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (error !== '') {
        setError('')
      }
    }, 5000)
    return () => {
      clearInterval(timeout)
    }
  }, [error])

  if (hasChecked) {
    if (isTokenValid) {
      return (
        <>
          <div className='reset-password-confirm-page'>
            <div className='container box'>
              <form
              className="container"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (pass1 !== pass2) {
                    setError("Password Doesn't match!")
                  }
                  if (pass1.length < 8) {
                    setError('Password must contain atleast 8 characters')
                  }
                  if (error !== '') {
                    console.log('Error occured')
                  } else {
                    axios
                      .post(`${API_URL}/api/reset-password-confirm/`, {
                        token,
                        pass1,
                        pass2,
                      })
                      .then((res) => {
                        console.log(res)
                        history.push('/')
                      })
                      .catch((err) => {
                        console.log(err)
                      })
                  }
                }}
              >
                <div className="title" style={{ textAlign: 'center' }}>
                  Create a new Password
                </div>
                <div className='field'>
                  <label className="label">New Password</label>
                  <input
                    type='password'
                    className='input'
                    placeholder='New Password'
                    required
                    value={pass1}
                    onChange={(e) => {
                      setPass1(e.target.value)
                    }}
                  />
                  <small>
                    <ul>
                      <li>Password must contain alteast 8 characters.</li>
                    </ul>
                  </small>
                </div>
                <div className='field'>
                  <label className="label">Re-Enter Password</label>
                  <input
                    type='password'
                    className='input'
                    placeholder='Re-Enter the password'
                    required
                    value={pass2}
                    onChange={(e) => {
                      setPass2(e.target.value)
                    }}
                  />
                </div>
                <div className='field'>
                  <button type='submit' className='button is-success'>
                    Submit
                  </button>
                </div>
                <p>{error}</p>
              </form>
            </div>
          </div>
        </>
      )
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <div
          className='card text-white bg-dark my-5'
          style={{ maxWidth: '20rem', textAlign: 'center', margin: 'auto' }}
        >
          <div className='card-body'>
            <h4 className='card-title'>
              Error Loading Reset Page try again later.
            </h4>
          </div>
        </div>
      </div>
    )
  }
  return <Spinner />
}

export default ResetPasswordConfirm
