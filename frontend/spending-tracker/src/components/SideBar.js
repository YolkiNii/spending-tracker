import useLogout from '../hooks/useLogout';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './SideBar.module.scss';
import { IconButton } from '@mui/material';

const SideBar = () => {
  const logout = useLogout();
  return (
    <nav className={styles.sidebar}>
      <h2>Spending Tracker</h2>
      <IconButton
        size='medium'
        sx={{ maxHeight: 26, maxWidth: 26, marginLeft: 1, marginBottom: 1 }}
        onClick={() => logout()}
      >
        <LogoutIcon />
      </IconButton>
    </nav>
  );
};

export default SideBar;
