import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import Spinner from "../components/Spinner";
import { API_URL } from "../const";
import { useInfluencerDetail } from "../store";

// import { MDBContainer, MDBRating } from "mdbreact";

interface MatchParams {
  id: string;
}

interface InfluencerDetailProps extends RouteComponentProps<MatchParams> {}

const InfluencerDetail: React.FC<InfluencerDetailProps> = ({ match }) => {
  const [offer, setOffer] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");
  const id = match.params.id;
  const influencer = useInfluencerDetail();

  useEffect(() => {
    influencer.actions.fetch(parseInt(id));
  }, [id]);

  if (influencer.state.hasLoaded) {
    return (
      <div className="influencer-detail container">
        <div className="ID-body box">
          <div className="title">{influencer.state.data.username}</div>
          <div className="influ-bio">
            <p>{influencer.state.data.bio}</p>
          </div>
          <div className="ID-images">
            <div className="ID-banner">
              <img src={`${API_URL}${influencer.state.data.banner}`} alt="" />
            </div>
            <img
              className="ID-pic"
              src={`${API_URL}${influencer.state.data.pic}`}
              alt=""
            />
          </div>
          <div className="ID-content">
            {/* <MDBContainer>
              <MDBRating />
            </MDBContainer> */}
            <div className="ID-rating">
              <p>{influencer.state.data.rating}</p>
            </div>

            <div className="profile-content">
              <div className="left">
                <div className="ID-budget">
                  <p>
                    <div className="title is-6" style={{ display: "inline" }}>
                      Budget:{" "}
                    </div>
                    {influencer.state.data.min_budget}-
                    {influencer.state.data.max_budget}
                  </p>
                </div>
                <div className="ID-about">
                  <div className="title is-5">About:</div>
                  <p>{influencer.state.data.about}</p>
                </div>
              </div>
              <div className="right">
                <div className="niche">
                  <button type="button" className="button is-light">
                    {influencer.state.data.niche}
                  </button>
                </div>
                <div className="contact">
                  <div className="dropdown is-hoverable">
                    <div className="dropdown-trigger">
                      <button
                        className="button is-link"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu4"
                      >
                        <span>Contacts</span>
                        <span className="icon is-small">
                          <i
                            className="fas fa-angle-down"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </button>
                    </div>
                    <div
                      className="dropdown-menu"
                      id="dropdown-menu4"
                      role="menu"
                    >
                      <div className="dropdown-content">
                        <div className="dropdown-item">
                          <a
                            href={`mailto:${influencer.state.data.email}`}
                            target="_blank"
                          >
                            Email
                          </a>
                        </div>
                        {influencer.state.data.insta_username && (
                          <div className="dropdown-item">
                            <a
                              href={`https://www.instagram.com/${influencer.state.data.insta_username}`}
                              target="_blank"
                              style={{ color: "red" }}
                            >
                              Instagram
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="button is-primary"
              onClick={() => setOffer(true)}
            >
              Create an offer
            </button>
            <div className={`modal ${offer && "is-active"}`}>
              <div
                className="modal-background"
                onClick={() => setOffer(false)}
              ></div>
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Create an offer</p>
                  <button
                    className="delete"
                    aria-label="close"
                    onClick={() => setOffer(false)}
                  ></button>
                </header>
                <section className="modal-card-body">
                  <div className="container">
                    <div className="field">
                      <label className="label">Title</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          placeholder="Give a title to your offer..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Subject</label>
                      <div className="control">
                        <input
                          type="textarea"
                          placeholder="Explain your offer..."
                          className="input"
                          value={subject}
                          onChange={(e) => {
                            if (e.target.value.length < 24) {
                              setSubject(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Price</label>
                      <input
                        type="text"
                        className="input"
                        value={price}
                        onChange={(e) => {
                          let reg = /[A-Za-z]/;
                          let newValue = e.target.value.replace(reg, "");
                          setPrice(newValue);
                        }}
                      />
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button className="button is-success">Send</button>
                  <button className="button" onClick={() => setOffer(false)}>
                    Cancel
                  </button>
                </footer>
              </div>
            </div>
            <hr />
            {influencer.state.data.reviews.length > 0 && (
              <div className="title is-5" style={{ marginBottom: "4px" }}>
                Reviews
              </div>
            )}
            <br />

            {influencer.state.data.reviews.map((review, i) => (
              <article className="media">
                <figure className="media-left">
                  <p className="image is-64x64">
                    <img
                      src={
                        review.is_public
                          ? `${API_URL}${review.consumer["pic"]}`
                          : "/assets/user1.png"
                      }
                    />
                  </p>
                </figure>
                <div className="media-content">
                  <div className="content">
                    <p>
                      <strong>
                        {review.is_public
                          ? review.consumer_username
                          : "Anonymous"}
                      </strong>{" "}
                      <small>{review.date}</small>
                      <br />
                      <h6 style={{ marginBottom: "0" }}>{review.title}</h6>
                      {review.text}
                    </p>
                  </div>
                  <nav className="level is-mobile">
                    <div className="level-left">
                      <a className="level-item">
                        <span className="icon is-small">
                          <i className="fas fa-reply"></i>
                        </span>
                      </a>
                      <a className="level-item">
                        <span className="icon is-small">
                          <i className="fas fa-retweet"></i>
                        </span>
                      </a>
                      <a className="level-item">
                        <span className="icon is-small">
                          <i className="fas fa-heart"></i>
                        </span>
                      </a>
                    </div>
                  </nav>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default InfluencerDetail;
