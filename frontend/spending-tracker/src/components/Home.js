import Login from "./Login";
import UserHome from "./UserHome";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const {auth} = useAuth();
    return (
        <>
            {auth?.username ? (
            <UserHome />
            ) : (
            <Login />
            )}
        </>
    );
}

export default Home;