import { useEffect, useState } from 'react';
import styles from './Login.module.css'

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

  useEffect(() => {
    setUsername('');
    setPassword('');
    setEmail('');
    setFirstName('');
    setLastName('');
  }, [creatingAccount]);

  const handleSubmit = e => {
    e.preventDefault();

    console.log('In handleSubmit');

    if (creatingAccount) {
      console.log({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'username': username,
        'password': password
      });
    }
    else {
      console.log({
        'username': username,
        'password': password
      });
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
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {form}
      </form>
      {creatingAccount ? <button className={styles.btnlink} type='button' onClick={() => setCreatingAccount(false)}>Login</button> :
        <button className={styles.btnlink} type='button' onClick={() => setCreatingAccount(true)}>Create an account</button>}
    </div>
  )
}

export default Login;
