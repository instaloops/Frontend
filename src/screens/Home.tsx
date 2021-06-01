import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactStars from "react-rating-stars-component";

import Spinner from "../components/Spinner";
import { API_URL } from "../const";
import { useInfluencerList, useNiche, useUser } from "../store";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [minRange, setMinRange] = useState("0");
  const [maxRange, setMaxRange] = useState("1000");
  const [rangeValue, setRangeValue] = useState("1000");
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState<string>("");

  const niches = useNiche();
  const influencers = useInfluencerList();
  const users = useUser();

  const searchRef = useRef();
  useEffect(() => {
    niches.actions.fetch();

    // users?.actions.fetch();
    // console.log(users);
  }, []);

  useEffect(() => {
    influencers.actions.fetch({
      search,
      niche,
    });
  }, [search, niche]);

  return (
    <div className="home-page">
      <div className="divider box">
        <div className="filters-divide">
          <h1 className="title is-4" style={{ textAlign: "center" }}>
            Filters
          </h1>
          <hr />
          <h3 className="title is-6">Budget Range</h3>
          <div className="ranges">
            <div className="min">
              <label>Min</label>
              <input
                type="text"
                value={minRange}
                onChange={(e) => {
                  let reg = /[A-Za-z]/;
                  let newValue = e.target.value.replace(reg, "");
                  setMinRange(newValue);
                }}
              />
            </div>
            <div className="max">
              <label>Max</label>
              <input
                type="text"
                value={maxRange}
                onChange={(e) => {
                  let reg = /[A-Za-z]/;
                  let newValue = e.target.value.replace(reg, "");
                  setMaxRange(newValue);
                }}
              />
            </div>
          </div>
          <div className="range">
            <input
              type="range"
              min={minRange}
              max={maxRange}
              value={rangeValue}
              onChange={(e) => setRangeValue(e.target.value)}
              style={{ width: "100%", marginRight: "5px" }}
            />
            <p>{rangeValue}</p>
          </div>
          <button
            type="button"
            className="button is-small is-primary is-outlined"
            onClick={() => {}}
          >
            Apply
          </button>
          <hr />
          {niches?.state.hasLoaded ? (
            <>
              <h3 className="title is-6">Niche</h3>
              {niches.state.data.map((niche, i) => (
                <label key={i} className="checkbox">
                  <input
                    type="radio"
                    value={niche.name}
                    className="niche-checkbox"
                    name="niche"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNiche(niche.name);
                      }
                    }}
                  />{" "}
                  {niche.name}
                </label>
              ))}
              <label className="checkbox">
                <input
                  type="radio"
                  name="niche"
                  value=""
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNiche("");
                    }
                  }}
                  checked={niche === ""}
                />{" "}
                All
              </label>
            </>
          ) : (
            <Spinner />
          )}
          {/* <hr />
          <button
            type="button"
            className="button is-small is-primary is-outlined"
            onClick={() => {
              let influData = influencers?.state.data.filter(
                (influencer) =>
                  influencer.min_budget >= parseInt(minRange) &&
                  influencer.max_budget <= parseInt(rangeValue)
              )
              // console.log(influData);

              const checkboxes = document.querySelectorAll(
                'input[name="niche"]:checked'
              )
              let niches = []
              checkboxes.forEach((checkbox: any) => {
                niches.push(checkbox.value)
              })
              // console.log(niches)
            }}
          >
            Save
          </button> */}
        </div>
        <div className="home-divide">
          <div className="search-bar">
            <input
              className="input"
              type="text"
              placeholder="Search"
              // @ts-ignore
              ref={searchRef}
            />
            <button
              className="button is-dark"
              title="Search"
              onClick={() => {
                // @ts-ignore
                setSearch(searchRef.current.value);
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="home-content">
            {influencers.state.hasLoaded ? (
              <div className="influencers-container">
                {influencers.state.data.map((influencer, i) => (
                  <div key={i} className="influencer-body box">
                    <div className="title-head">
                      <Link
                        to={`/influencer/${influencer.id}`}
                        style={{ color: "#000", textDecoration: "none" }}
                      >
                        <div className="title">{influencer.username}</div>
                      </Link>
                      <small className="button is-light">
                        {influencer.niche}
                      </small>
                    </div>

                    <div className="influ-images">
                      <div className="influ-banner">
                        <img src={`${API_URL}${influencer.banner}`} alt="" />
                      </div>
                      <img
                        className="influ-pic"
                        src={`${API_URL}${influencer.pic}`}
                        alt=""
                      />
                    </div>

                    <div className="influ-bio">
                      <p>{influencer.bio}</p>
                    </div>
                    <div className="influ-budget">
                      <p className="button is-light">
                        Budget: {influencer.min_budget}-{influencer.max_budget}
                      </p>
                    </div>
                    <div className="influ-about">
                      <h4 className="title is-5">About:</h4>
                      <p>{influencer.about}</p>
                    </div>
                    <br />
                    <div className="influ-rating">
                      <ReactStars
                        count="5"
                        size={24}
                        activeColor="#ffd700"
                        value={influencer.rating}
                        edit={false}
                      />
                      <span>({influencer.review_count})</span>
                    </div>

                    <hr />
                  </div>
                ))}
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
