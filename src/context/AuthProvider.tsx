import React, { useState } from "react";
import { TAuthContext, TServerCall } from "../types/authContext";
import useCookie from "react-use-cookie";
import jwtDecode from "jwt-decode";
import { BASE_URL, api, apiV2 } from "services/axios";
import useLocalStorage from "hooks/useLocalStorge";
import { ILoggedInUser } from "types/user";
import { convertArabicCharToPersian } from "services/convertArabicCharToPersian";
import { useSnackbar } from "hooks/useSnackbar";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

let localToken = "";
// "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJFc296OFJYR0JwdERoQXE2NUROTjE5UW9NZThfYk5rVXRmcGZTVk1pM1dVIn0.eyJleHAiOjE3MDQwNTU2MTIsImlhdCI6MTcwMzE5MTYxMiwianRpIjoiMDk0OWI2YzgtMGY4Ni00NjUxLTk1ZGQtNTZmMTMxODdiZTkxIiwiaXNzIjoiaHR0cDovLzE5Mi4xNjguMS4xNDk6OTA4MC9hdXRoL3JlYWxtcy90YXZhbmEiLCJhdWQiOlsiYmFzZV9pbmZvcm1hdGlvbl91aSIsImJhc2VfaW5mb3JtYXRpb25fc3J2IiwiZnVuZF9zcnYiLCJhY2NvdW50Il0sInN1YiI6ImFkZGE5N2M1LTlmM2UtNGRhOC04OWQ4LTc2OWU1ZGM1NWI0MyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFwcGxpY2FudF9zcnYiLCJzZXNzaW9uX3N0YXRlIjoiOGY5YmU3NTMtZWVjZC00NTU1LWEzOGUtNzM3YWYyYzk0NzJhIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtdGF2YW5hIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJiYXNlX2luZm9ybWF0aW9uX3VpIjp7InJvbGVzIjpbImFkbWluIl19LCJiYXNlX2luZm9ybWF0aW9uX3NydiI6eyJyb2xlcyI6WyJhZG1pbiJdfSwiZnVuZF9zcnYiOnsicm9sZXMiOlsiYWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjhmOWJlNzUzLWVlY2QtNDU1NS1hMzhlLTczN2FmMmM5NDcyYSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6Itit2KzYqiDYtNio2KfYqCIsInByZWZlcnJlZF91c2VybmFtZSI6ImhvamF0IiwiZ2l2ZW5fbmFtZSI6Itit2KzYqiIsImZhbWlseV9uYW1lIjoi2LTYqNin2KgifQ.cxgNUOQLtOxJLAk6xlli87FsWGIYiVi9Y9p11GE2erdkn_SeQx_fVxVDR472pVhnoObIZi6gmam0WjYMEYMWY8G9vPr0D7HXdlFMxzOWhuV9tQNGiRtgrkLy5v79DBleEeeKlEWgY4l1u0db-ox6myrwFYIBlmeJJ-PxOaqnAz9nW9i5BD0Cjiq9PhRTJCxFNqpcg0fiN1W1KK6jdlywxh9ErSDLjO7sLjIsBqqPPkqHiDoKjPoX9Iqk171WuB137cNLn8UlJjBH9aHn-XEz65EOc8GQ6COib2uuK4_29sof9GsOgGJXcl3C1BfT2xZasyXLWPtzt7ZHTm9BDFoIrQ";

export const AuthContext = React.createContext<TAuthContext | null>(null);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const snackbar = useSnackbar();
  const [token, setToken] = useCookie("token", localToken);
  const [userInfo, setUserInfo] = useLocalStorage<ILoggedInUser>("userInfo", { full_name: "", user_id: 0 });

  const [isRefreshingToken, setIsRefreshingToken] = useState(false);

  function storeToken(t: string) {
    let tempDay = getExpireDate(t);
    localToken = t;
    setToken(t, {
      days: tempDay,
    });
  }

  function storeRefreshToken(refresh_token: string) {
    localStorage.setItem("refreshToken", refresh_token);
  }

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;

      // -------------
      //TODO: stop multiple refresh token request
      const onRefresh = async () => {
        if (!isRefreshingToken) {
          setIsRefreshingToken(true);
          let tempRefreshToken = localStorage.getItem("refreshToken");
          try {
            let requestOptions = {
              url: `${BASE_URL}user/refresh_token`,
              method: "GET",
              headers: {
                Authorization: "Bearer " + tempRefreshToken,
              },
              redirect: "follow",
            };
            let response = await axios({ ...requestOptions });
            if (response.status === 200) {
              return response.data.result;
            } else {
              clearUserInfo();
              throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
            }
          } catch (e) {
            clearUserInfo();
            throw new Error(JSON.stringify(e) || `خطا در انجام عملیات`);
          } finally {
            setIsRefreshingToken(false);
          }
        }
      };
      // -------------

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await onRefresh();
          storeToken(newToken?.token);
          localToken = newToken.token;
          localStorage.setItem("refreshToken", newToken.refreshToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken?.token}`;

          //update token
          return api(originalRequest);
        } catch (e) {
          console.log(e);
        }
      }

      return Promise.reject(error);
    }
  );

  const serverCall = async ({ entity, method, data = { test: 1 } }: TServerCall) => {
    try {
      let requestOptions = {
        url: convertArabicCharToPersian(entity),
        method,
        headers: {
          "Accept-Language": "fa",
          Authorization: "Bearer " + (localToken || token),
        },
        redirect: "follow",
        ...(data && { data: convertArabicCharToPersian(JSON.stringify(data)) }),
      };
      let response = await api({ ...requestOptions });
      if (response.status === 200) {
        return response.data;
      } else if (response.status === 204) {
        return { data: { rows: [] } };
      } else {
        throw new Error(`خطا در انجام عملیات - ${response?.statusText}`);
      }
    } catch (e) {
      throw new Error(JSON.stringify(e) || `خطا در انجام عملیات`);
    }
  };

  async function logout() {
    try {
      clearUserInfo();
    } catch (error) {
      snackbar("خطا در ثبت خروج، لطفا مجدد تلاش کنید", "error");
      console.log(error);
    }
  }
  function clearUserInfo() {
    setToken("");
    setUserInfo({ full_name: "", user_id: 0 });
    localToken = "";
    window.location.href = process.env.PUBLIC_URL;
  }
  const getRequest = async ({
    queryKey,
  }: {
    queryKey: string | number | boolean | Array<number | boolean | string>;
  }) => {
    let tempEntity = queryKey;
    if (Array.isArray(queryKey)) {
      tempEntity = queryKey.join("/");
    }
    tempEntity = String(tempEntity);
    try {
      return await serverCall({ entity: tempEntity, method: "get" });
    } catch (error: any) {
      throw new Error(error?.message || `خطا در انجام عملیات`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        storeToken,
        serverCall,
        getRequest,
        isUserLoggedIn: !!token,
        logout,
        userInfo,
        setUserInfo,
        storeRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

type TDecodedToken = {
  iat: number;
  exp: number;
};
function getExpireDate(token: string) {
  const DAY_IN_MILLISECONDS = 86400000;
  let decoded: TDecodedToken = jwtDecode(token);
  let expire = decoded.exp * 1000; // convert to miliseconds
  let now = new Date().getTime(); // get current time
  let result = (expire - now) / DAY_IN_MILLISECONDS; // get expire time base on milisecond in day
  return result;
}
