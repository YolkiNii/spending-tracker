import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import Spendings from './Spendings';
import { SpendingsProvider } from '../context/SpendingsProvider';
import SideBar from './SideBar';
import styles from './UserHome.module.scss';

const USERS_URL = '/users';

const UserHome = () => {
  const { auth, setAuth } = useAuth();
  const [user, setUser] = useState({});
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();
    console.log('UserHome useEffect');

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(
          USERS_URL + `/${auth.username}`,
          {
            signal: controller.signal
          }
        );
        console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.error(err);
        // Token is not valid
        if (err?.response?.status === 403) setAuth({});
      }
    };

    getUser();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className={styles.container}>
      <SideBar />
      <SpendingsProvider>
        <Spendings />
      </SpendingsProvider>
    </main>
  );
};

export default UserHome;
