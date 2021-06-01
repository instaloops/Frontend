import axios from "axios";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { API_URL } from "./const";
import { loadCache } from "./utils";

const df = {
  authToken: loadCache<string>("token", null),
  authError: {
    login: {},
    signup: {},
  },
  user: {
    pk: 0,
    email: "",
    username: "",
    hasLoaded: false,
    status: "uncreated",
  },
  influencerList: {
    data: [],
    hasLoaded: false,
    page_count: 1,
  },
  bannerList: {
    data: [],
    hasLoaded: false,
  },
  nicheList: {
    data: [],
    hasLoaded: false,
  },
  consumer: {
    hasLoaded: false,
    id: 0,
    pic: "",
    user: 0,
  },
  influencer: {
    hasLoaded: false,
    id: 0,
    user: 0,
    username: "",
    email: "",
    min_budget: 0,
    max_budget: 0,
    niche: "",
    pic: "",
    bio: "",
    about: "",
    rating: 0,
    review_count: 0,
    banner: "",
    reviews: [],
    insta_username: "",
  },
};
// @ts-ignore
const storeContext = React.createContext<Store>(null);

const StoreProvider: React.FC = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(df.authToken);
  const [authError, setAuthError] = useState<AuthError>(df.authError);

  const [user, setUser] = useState<UserState>(df.user);
  const [banner, setBanner] = useState<BannerState>(df.bannerList);
  const [consumer, setConsumer] = useState<ConsumerState>(df.consumer);
  const [niche, setNiche] = useState<NicheState>(df.nicheList);
  const [influencerAuth, setInfluencerAuth] = useState<InfluencerAuthState>(
    df.influencer
  );
  const [influencerList, setInfluencerList] = useState<InfluencerListState>(
    df.influencerList
  );
  const [influencerDetail, setInfluencerDetail] =
    useState<InfluencerDetailState>({ data: df.influencer, hasLoaded: false });

  const headers = useMemo(
    () => ({
      Authorization: `Token ${authToken}`,
    }),
    [authToken]
  );
  const authLogin = useCallback(
    async (f: LoginFields) => {
      try {
        const res = await axios.post<{ key: string }>(
          `${API_URL}/rest-auth/login/`,
          f
        );
        localStorage["token"] = res.data.key;
        setAuthToken(res.data.key);
        return true;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.data) {
            let authenticationErrors: { [s: string]: string } = {
              "Unable to log in with provided credentials.":
                "The provided email or password is incorrect",
              "User account is disabled.": "This account is blocked",
              "E-mail is not verified.": "Account is not verified",
            };
            if ("non_field_errors" in err.response.data) {
              let msg = err.response.data["non_field_errors"][0];
              if (typeof msg === "string") {
                if (authenticationErrors.hasOwnProperty(msg)) {
                  setAuthError({
                    ...authError,
                    login: { authentication: authenticationErrors[msg] },
                  });
                }
              }
            }
          }
        }
        return false;
      }
    },
    [authError]
  );

  const authSignup = useCallback(
    async (f: SignUpFields) => {
      try {
        await axios.post(`${API_URL}/rest-auth/registration/`, f);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (
            err.response?.data.email[0] ===
              "A user is already registered with this e-mail address." ||
            err.response?.data.username[0] ===
              "A user with that username already exists."
          ) {
            setAuthError({
              ...authError,
              signup: { authentication: "Account Already exists." },
            });
          }
        }
      }
      return;
    },
    [authError]
  );

  const authLogout = useCallback(async () => {
    localStorage.removeItem("token");
    await axios.post(`${API_URL}/rest-auth/logout/`, {}, { headers });
    setAuthToken(null);
    return;
  }, [headers]);

  const userFetch = useCallback(async () => {
    const res = await axios.get<User>(`${API_URL}/rest-auth/user/`, {
      headers,
    });
    setUser({ ...res.data, hasLoaded: true });
  }, [headers]);

  const bannerFetch = useCallback(async () => {
    const res = await axios.get<Banner[]>(`${API_URL}/api/site/banner/`, {
      headers,
    });
    setBanner({ data: res.data, hasLoaded: true });
  }, [headers]);

  const consumerFetch = useCallback(async () => {
    const res = await axios.get<Consumer>(`${API_URL}/api/social/consumer/`, {
      headers,
    });
    setConsumer({ ...res.data, hasLoaded: true });
  }, [headers]);

  const nicheFetch = useCallback(async () => {
    const res = await axios.get<Niche[]>(`${API_URL}/api/social/niche/`);
    setNiche({ data: res.data, hasLoaded: true });
  }, []);

  const influencerAuthFetch = useCallback(async () => {
    const res = await axios.get<Influencer>(
      `${API_URL}/api/social/influencer/`,
      { headers }
    );
    setInfluencerAuth({ ...res.data, hasLoaded: true });
  }, [headers]);

  const influencerListFetch = useCallback(
    async (params: InfluencerListFilterParams) => {
      setInfluencerList(df.influencerList);
      const res = await axios.get<{
        influencers: Influencer[];
        page_count: number;
      }>(
        `${API_URL}/api/social/influencers/?${
          params.niche ? `niche=${encodeURI(params.niche)}` : ""
        }${params.search ? `search=${encodeURI(params.search)}` : ""}`
      );
      setInfluencerList({
        data: res.data.influencers,
        hasLoaded: true,
        page_count: res.data.page_count,
      });
    },
    []
  );

  const influencerDetailFetch = useCallback(async (id: number) => {
    const res = await axios.get<Influencer>(
      `${API_URL}/api/social/influencers/${id}/`
    );
    setInfluencerDetail({ data: res.data, hasLoaded: true });
  }, []);
  return (
    <storeContext.Provider
      value={{
        auth: {
          state: {
            token: authToken,
            isAuthenticated: authToken !== null,
          },
          actions: {
            login: authLogin,
            signup: authSignup,
            logout: authLogout,
          },
          error: authError,
        },
        user: {
          state: user,
          actions: {
            fetch: userFetch,
          },
        },
        banner: {
          state: banner,
          actions: { fetch: bannerFetch },
        },
        consumerAuth: {
          state: consumer,
          actions: { fetch: consumerFetch },
        },
        niche: {
          state: niche,
          actions: { fetch: nicheFetch },
        },
        influencerAuth: {
          state: influencerAuth,
          actions: { fetch: influencerAuthFetch },
        },
        influencerList: {
          state: influencerList,
          actions: {
            fetch: influencerListFetch,
          },
        },
        influencerDetail: {
          state: influencerDetail,
          actions: {
            fetch: influencerDetailFetch,
          },
        },
      }}
    >
      {children}
    </storeContext.Provider>
  );
};

const useAuth = () => useContext(storeContext).auth;
const useUser = () => useContext(storeContext).user;
const useBanners = () => useContext(storeContext).banner;
const useNiche = () => useContext(storeContext).niche;
const useConsumerAuth = () => useContext(storeContext).consumerAuth;
const useInfluencerAuth = () => useContext(storeContext).influencerAuth;
const useInfluencerList = () => useContext(storeContext).influencerList;
const useInfluencerDetail = () => useContext(storeContext).influencerDetail;

export {
  StoreProvider,
  useAuth,
  useBanners,
  useConsumerAuth,
  useNiche,
  useUser,
  useInfluencerAuth,
  useInfluencerList,
  useInfluencerDetail,
};
