import { useEffect, useState } from 'react';
import styles from './Login.module.css'
import baseAPI from '../api/base';

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

  const handleSubmit = e => {
    e.preventDefault();

    if (creatingAccount) {
      const newUser = {
        email,
        firstName,
        lastName,
        username,
        password
      }

      console.log(newUser);

      // send new account info
      
      // check if user is valid
    }
    // attempt login
    else {
      const user = {
        username,
        password
      }

      console.log(user);

      //
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
  )
}

export default Login;
