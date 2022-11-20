import baseAPI from "../api/base";
import useAuth from "./useAuth";

const REFRESH_URL = '/refresh';

const useRefreshToken = () => {
    const {setAuth} = useAuth();
    
    const refresh = async () => {
        const response = await baseAPI.get(REFRESH_URL, {
            withCredentials: true
        });
        setAuth(prev => {
            return {...prev, accessToken: response.data.accessToken}
        });
        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;