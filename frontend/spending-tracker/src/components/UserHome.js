import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import Spendings from "./Spendings";

const USERS_URL = '/users';

const UserHome = () => {
    const {auth, setAuth} = useAuth();
    const [user, setUser] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const logout = useLogout();

    useEffect(() => {
        const controller = new AbortController();
        console.log("UserHome useEffect");

        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(USERS_URL + `/${auth.username}`, {
                    signal: controller.signal
                });
                console.log(response.data);
                setUser(response.data);
            }
            catch (err) {
                console.error(err);
                // Token is not valid
                if (err?.response?.status === 403)
                    setAuth({});
            }
        }

        getUser();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <div>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <button type='button' onClick={() => logout()}>Sign Out</button>
            <Spendings />
        </div>
    );
}

export default UserHome;