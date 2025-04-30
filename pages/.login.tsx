import axios from 'axios';
import { ChangeEvent, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

type LoginParams = {
  email: string;
  password: string;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const changeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const changePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleClick = () => {
    const loginParams: LoginParams = { email, password };
    axios
      .get('http://photoproofapp.local/sanctum/csrf-cookie', { withCredentials: true })
      .then(() => {
        // ログイン処理
        axios
          .post('http://photoproofapp.local/api/1.0/login', loginParams, { withCredentials: true })
          .then((response) => {
            console.log(response.data); // Assuming the response contains the user data
            // Save the session token or identifier in a cookie
            Cookies.set('session_token', response.data.session_token, { expires: 1 }); // Set expiration for 1 day
            // Redirect to the user's dashboard (or "My Page" in your case)
            router.push('/dashboard'); // Replace '/dashboard' with your actual dashboard page URL
          })
          .catch((error) => {
            console.error('Login failed:', error);
          });
      });
  };

  return (
    <>
      <div>
        メールアドレス
        <input onChange={changeEmail} />
      </div>
      <div>
        パスワード
        <input onChange={changePassword} />
      </div>
      <div>
        <button onClick={handleClick}>ログイン</button>
      </div>
    </>
  );
}
