import { useState } from "react";
import useAxios from "spotify-auth/spotify-http-client";

export const useSpotifyUserInfo = () => {
  const { sendRequest } = useAxios<SpotifyUSerInfoResponse>();
  const [userInfo, setUserInfo] = useState<SpotifyUSerInfoResponse | null>(null);

  const getUserInfo = async () => {
    return sendRequest({
      url: "/v1/me",
    }).then(response => {
      if (response?.data) {
        const info = {
          country: response?.data.country,
          display_name: response?.data.display_name,
          email: response?.data.email
        }
        if (Object.values(info).every(value => value)) {
          setUserInfo(info);
          return info;
        }
      }
      return null;
    });
  };

  return { getUserInfo, userInfo };
}


interface SpotifyUSerInfoResponse {
  display_name: string;
  email: string;
  country: string;
}