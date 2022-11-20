import { useEffect, useState, useContext } from 'react';
import styles from './Login.module.css'
import baseAPI from '../api/base';
import AuthContext from '../context/AuthProvider';

const REGISTER_URL = '/register';
const LOGIN_URL = '/auth';

const MyInputField = ({label, type, value, handleChange}) => {
  return (
    <>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => handleChange(e.target.value)}
      />
    </>
  )
}

const Login = () => {
  const {setAuth} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // blank all fields when switching
  useEffect(() => {
    setUsername('');
    setPassword('');
    setEmail('');
    setFirstName('');
    setLastName('');
  }, [creatingAccount]);

  // remove error message when user re inputs
  useEffect(() => {
    setErrorMsg('');
  }, [username, password, email, firstName, lastName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const login = async () => {
      const user = {
        username,
        password
      }

      try {
        const response = await baseAPI.post(LOGIN_URL,
          JSON.stringify(user),
          {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
          }
        );
        
        const accessToken = response?.data?.accessToken;
        setAuth({username, accessToken});
        setUsername('');
        setPassword('');
      }
      catch (err) {
        if (!err?.response)
          setErrorMsg('No Server Response');
        else if (err.response?.status === 400)
          setErrorMsg('Missing Username or Password');
        else if (err.response?.status === 401)
          setErrorMsg('Unauthorized');
        else
          setErrorMsg('Login Failed');
      }
    }

    if (creatingAccount) {
      const newUser = {
        email,
        firstName,
        lastName,
        username,
        password
      }

      // send new account info
      try {
        const response = await baseAPI.post(REGISTER_URL, 
          JSON.stringify(newUser),
          {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
          }
        );
        console.log(response.data);
        console.log(response.accessToken);
        console.log(JSON.stringify(response));
        await login();
        setUsername('');
        setPassword('');
        setEmail('');
        setFirstName('');
        setLastName('');
      } 
      catch (err) {
        if (!err?.response)
          setErrorMsg('No Server Response');
        else if (err.response?.status === 409)
          setErrorMsg('Username Taken');
        else
          setErrorMsg('Registration Failed');
      }
    }
    // attempt login
    else {
      await login();
    }
  }

  const accountCreateInputs = (
    <>
      <MyInputField 
        label='Email'
        type='text'
        value={email}
        handleChange={setEmail}
      />
      <MyInputField 
        label='First Name'
        type='text'
        value={firstName}
        handleChange={setFirstName}
      />
      <MyInputField
        label='Last Name'
        type='text'
        value={lastName}
        handleChange={setLastName}
      />
    </>
  );

  const userInputs = (
    <>
      <MyInputField 
        label='Username'
        type='text'
        value={username}
        handleChange={setUsername}
      />
      <MyInputField
        label='Password'
        type='password'
        value={password}
        handleChange={setPassword}
      />
    </>
  );

  const createAccountForm = (
    <>
      {accountCreateInputs}
      {userInputs}
      <button className={styles.btn} type='submit'>Create Account</button>
    </>
  )

  const userForm = (
    <>
      {userInputs}
      <button className={styles.btn} type='submit'>Login</button>
    </>
  )

  const form = creatingAccount ? createAccountForm : userForm;

  return (
    <div className={styles.container}>
      {errorMsg ? <p className={styles.error}>{errorMsg}</p> : null}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {form}
      </form>
      {creatingAccount ? <button className={styles.btnlink} type='button' onClick={() => setCreatingAccount(false)}>Login</button> :
        <button className={styles.btnlink} type='button' onClick={() => setCreatingAccount(true)}>Create an account</button>}
    </div>
  );
}

export default Login;
