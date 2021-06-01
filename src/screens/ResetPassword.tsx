import axios from "axios";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { API_URL } from "../const";

interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="reset-password">
      <div className="container box">
        <form
          className="container"
          onSubmit={(e) => {
            e.preventDefault();
            axios
              .post(`${API_URL}/api/reset-password/`, {
                email: email,
              })
              .then((res) => {
                setSent(true);
                console.log(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
            setRequest(true);
          }}
        >
          <div className="title" style={{ textAlign: "center" }}>
            Reset Password
          </div>
          <fieldset>
            <div className="field">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Enter your registered Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                disabled={sent}
              />
            </div>
            <div className="field">
              <button
                type="submit"
                className="button is-success"
                disabled={sent}
              >
                Submit
              </button>
            </div>
          </fieldset><br />
      {request && (
        <div>
          {sent ? (
            <h2 className="contianer text-white text-center">
              Reset Password link is sent to the email!
            </h2>
          ) : (
            <Spinner />
          )}
        </div>
      )}
        </form>
      </div>
      
    </div>
  );
};

export default ResetPassword;
