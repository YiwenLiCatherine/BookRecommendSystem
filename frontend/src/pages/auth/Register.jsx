import { React, useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, InputLabel, MenuItem, NativeSelect, Select } from '@mui/material'
import countries from './countries.json'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Task Master
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();


export default function Register() {
  const navigate = useNavigate();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [dob, setDob] = useState("null");
  const [email, setEmail] = useState("");
  const [age, setAge ] = useState("");
  const [country, setCountry] = useState("");
  const [collections, setCollections] = useState([{"Main Collection": []}]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [score, setScore] = useState(0)
  const [checked, setIsChecked] = useState(false);
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const checkboxHandler = () => {
    setIsChecked(!checked);
  }

  console.log({
    firstName,lastName,dob,email,age,country,collections,username,password,confirmPassword,ratings, comments,
  });

  function checkUserValid(firstName,lastName,username) {
    if (firstName === ''){
      alert('Please Input your first name');
      return false;
    } else if (lastName === '') {
      alert('Please Input your last name');
      return false;
    } else if (username === '') {
      alert('Please Input your username');
      return false;
    } else {
      console.log("name valid");
      return true;
    }
  }

  function checkEmailValid(email) {
    if (!re.test(email)) {
        alert('Please Input a valid email');
        return false;
      } else if ( email === '') {
        alert('Please Input your email');
        return false;
      } else {
        console.log("email valid");
        return true;
      }
    }

    function checkPasswordValid(password,confirmPassword) {
      if ( password === '') {
        alert('Please Input your password');
        return false;
      } else if ( confirmPassword === ''){
        alert('Please Input your confirm password');
        return false;
      } else if ( password !== confirmPassword ) {
        alert("Password and confirm password do not match");
        return false;
      } else {
        console.log("password valid");
        return true;
      }
    }

    function checkInfoValid(age) {
      if ( age <0 || age > 150) {
        alert('Please input a right age');
        return false;
      } else {
        console.log("age valid");
        return true;
      }
    }

    function Submitbtn () {
      console.log("let's submit");
      console.log("submit data");
      console.log({
        firstName,lastName,dob,email,age,country,collections,username,password,confirmPassword,ratings, comments,
      });

      if (!checkUserValid(firstName,lastName,username) || !checkEmailValid(email) || !checkPasswordValid(password,confirmPassword) || !checkInfoValid(age) ){
        return false;
      }

      const userData = {
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        email: email,
        age: age,
        country: country,
        collections: collections,
        username: username,
        password: password,
        ratings: ratings,
        comments: comments,
        score: score,
      }

        let para = {
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
          },
        }
        fetch(`http://127.0.0.1:5000/storeuser/putuserdata`, para).then(result => {
          if (result.status === 200) {
            result.json().then(result => {
              alert('Register Successfully!');
              navigate("/login");
            })
          } else {
            result.json().then(result => {
              alert('Register Failed, try again!');
              return false;
            })
          }
        })
       }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Register
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e)=>setfirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e)=>setlastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth

                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onChange={(e)=>setUserName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="age"
                  label="Age(valid between 0~150)"
                  type="number"
                  id="age"
                  autoComplete='age'
                  InputProps={{inputProps: {min:0, max: 150}}}
                  onChange={(e)=>setAge(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
              <Autocomplete
                id="country"
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                onChange={(e)=>setCountry(e.target.value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {option.label} ({option.code}) +{option.phone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              </Grid>
            </Grid>
            <div>
            <input type="checkbox" id="agree" onChange={checkboxHandler} />
            <Button variant='text' onClick={()=> navigate("/termsCondition")}>Agree Terms and Conditions</Button>
            </div>
            <Button
              disabled={!checked}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={Submitbtn}
            >
              Register
            </Button>
            <Button
              type="primary"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Link to="/">
                <Button
                  type="submit"
                  fullWidth
                  variant='text'
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => navigate("/")}
                >
                  Dashboard
                </Button>
              </Link>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
