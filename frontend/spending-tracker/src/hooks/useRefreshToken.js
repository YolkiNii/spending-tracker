import baseAPI from '../api/base';
import useAuth from './useAuth';

const REFRESH_URL = '/refresh';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    // get a new access token with user's refresh token in cookie
    const response = await baseAPI.get(REFRESH_URL, {
      withCredentials: true
    });
    setAuth((prev) => {
      return {
        ...prev,
        username: response.data.username,
        accessToken: response.data.accessToken
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
