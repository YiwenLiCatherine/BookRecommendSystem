import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © COMP9900 Task_Master'}
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login(props) {
  const navigate = useNavigate();
  const [userName, setuserName] = useState('');
  const [password, setPassword] = useState('');

  const isLoggedIn = props.isLoggedIn 
  const setLoggedIn = props.setLoggedIn 
  const currUsername = props.currUsername 
  const setCurrUsername = props.setCurrUsername

  const wallpaper = require('../../img/book_wallpaper.jpg');


  function checkInput() {
    if (userName === '') {
      alert("Please enter your username");
      return false;
    } else if (password === '') {
      alert("Please enter a password");
      return false;
    } else {
      return true;
    }
  }

  function LoginBtn () {
    console.log("let check login");

    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("username");
    setLoggedIn(false);
    setCurrUsername("");

    if (!checkInput()) {
      return false;
    }

    const userInfo = {
      username: userName,
      password: password,
    };

    console.log(userInfo);

    const para = {
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch(`http://127.0.0.1:5000/getuser/checkuserbycred`, para).then(result => {
      if (result.status === 200) {
        result.json().then(result => {
          if (result.STATUS === "User Exits"){
            alert('login successfully!');
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("username", userName);
            console.log("localstorage filled");
            props.setLoggedIn(true);
            props.setCurrUsername(userName);
            navigate('/dashboard');
          } else {
            alert('Please input the right username and password');
            return false;
          }
        })
      } else {
        result.json().then(result => {
          alert('Please input the right username and password');
          return false;
        })
      }
    })
  };

  useEffect(() => {
    console.log(localStorage)
    if(localStorage.getItem("isLoggedIn") === 'true' && localStorage.getItem("username").length > 0){
      setLoggedIn(true);
      setCurrUsername(localStorage.getItem("username"));
      console.log("Login: isLoggedIn true")
    }
    else{
      setLoggedIn(false);
      setCurrUsername("");
      console.log("Login: isLoggedIn false")
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundImage: `url(${wallpaper})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e)=>setuserName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={LoginBtn}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant='outlined'
                sx={{ mt: 3, mb: 2 }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
              <Link to="/">
                <Button
                  fullWidth
                  variant='text'
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => navigate("/")}
                >
                  Dashboard
                </Button>
              </Link>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
