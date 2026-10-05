import Notification from './Notification';
import LoginForm from './LoginForm';

const LoginPage = ({ message, handleLogin, displayNotification }) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <Notification message={message} />

      <LoginForm
        handleLogin={handleLogin}
        displayNotification={displayNotification}
      />
    </div>
  );
};

export default LoginPage;
