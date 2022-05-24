import * as React from 'react'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from "../components/Navbar"
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import SearchIcon from "@mui/icons-material/Search"
import FriendList from '../components/FriendList'
import UserInfo from '../components/UserInfo'
import CollectionContainer from '../components/CollectionContainer'
import { makeStyles } from '@material-ui/styles'



const theme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        Task Master
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function UserProfile(props) {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');

  const [isMyProfile, setIsMyProfile] = useState(false);

  const params = useParams();

  useEffect(() => {
    const targetUsername = params.username
    if (targetUsername === props.currUsername) {
      setIsMyProfile(true)
    }
    else{
      setIsMyProfile(false)
    }

    setUsername(targetUsername)

  }, [params.username, props.currUsername])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Navbar isLoggedIn={props.isLoggedIn} currUsername={props.currUsername} />
        <main>
          <Box sx={{ marginTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 0 }}>
            <Typography component="h1" variant="h4">
              User Profile
            </Typography>
          </Box>

          <Box style={{ width:"100%"}} sx={{ flexGrow: 1, marginTop: "10px", marginBottom: 0, paddingBottom:0 }}>
            <Grid container>
              <Grid item xs={7} sx={{marginTop: "5px", marginLeft:"30px"}}>
                <UserInfo isMyProfile={isMyProfile} username={username} currUsername = {props.currUsername}/>
              </Grid>
              <Grid item xs={4} sx={{ marginLeft: "40px", marginTop: "10px" ,height:"400px" }}>
                <Paper width="300" variant="outlined" >
                  <FriendList isMyProfile={isMyProfile} username={username}/>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{marginTop: 0}}>
            <CollectionContainer username={params.username} allowWrite={isMyProfile}></CollectionContainer>
          </Box>
        </main>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
