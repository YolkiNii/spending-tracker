import baseAPI from '../api/base';
import useAuth from './useAuth';

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await baseAPI('/logout', {
        withCredentials: true
      });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
