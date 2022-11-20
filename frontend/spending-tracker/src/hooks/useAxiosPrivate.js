import { privateBaseAPI } from '../api/base';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const {auth} = useAuth();

    useEffect(() => {
        console.log('In AxiosPrivate: ', auth);
        const requestIntercept = privateBaseAPI.interceptors.request.use(
            config => {
                // check if token is there
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = privateBaseAPI.interceptors.response.use(
            // response has no issue
            response => response,
            // check if access token expired
            async (error) => {
                const prevRequest = error?.config;

                // token was expired
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return privateBaseAPI(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            privateBaseAPI.interceptors.request.eject(requestIntercept);
            privateBaseAPI.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh]);

    return privateBaseAPI;
}

export default useAxiosPrivate;