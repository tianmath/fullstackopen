const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const className =
    message.type === 'error' ? 'message error' : 'message success';

  return <div className={className}>{message.text}</div>;
};

export default Notification;
