import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Menu = ({ user, handleLogout }) => {
  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Stack
          direction='row'
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <div>
            <Button color='inherit' component={Link} to='/' sx={style}>
              blogs
            </Button>

            {!user ? (
              <Button
                color='inherit'
                variant='outlined'
                component={Link}
                to='/login'
                sx={{ ...style, marginLeft: 3 }}
              >
                login
              </Button>
            ) : (
              <>
                <Button
                  color='inherit'
                  component={Link}
                  to={'/create'}
                  sx={style}
                >
                  new blog
                </Button>
                <Button
                  color='inherit'
                  variant='outlined'
                  onClick={handleLogout}
                  sx={{ ...style, marginLeft: 3 }}
                >
                  logout
                </Button>
              </>
            )}
          </div>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
