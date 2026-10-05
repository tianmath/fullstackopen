import LoginForm from './LoginForm';

const LoginPage = ({ handleLogin, displayNotification }) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <LoginForm
        handleLogin={handleLogin}
        displayNotification={displayNotification}
      />
    </div>
  );
};

export default LoginPage;
