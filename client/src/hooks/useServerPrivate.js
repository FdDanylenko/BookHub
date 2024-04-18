import { serverPrivate } from "../api/server";
import { useEffect, useContext } from "react";
import useRefreshToken from "./useRefreshToken";
import CustomerDataContext from "../context/CustomerDataContext";

const useServerPrivate = () => {
  const refresh = useRefreshToken();
  const { accessToken, setAccessToken } = useContext(CustomerDataContext);
  useEffect(() => {
    const requestIntercept = serverPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseIntercept = serverPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true;
          const newAccessToken = refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return serverPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      serverPrivate.interceptors.request.eject(requestIntercept);
      serverPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);
  return serverPrivate;
};

export default useServerPrivate;
