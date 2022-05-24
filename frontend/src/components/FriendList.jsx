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
import { useNavigate } from 'react-router-dom'
import Navbar from "../components/Navbar"
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { makeStyles } from '@material-ui/styles'

const theme = createTheme();


export default function FriendList(props) {
  const navigate = useNavigate();
  const [followList, setFollowList] = useState([]);

  useEffect(() => {
    fetchFollowed('http://127.0.0.1:5000/follow/getall', props.username)
  }, [props.username, props.isMyProfile])

  const fetchFollowed = async (apiURL, currUsername) => {
    console.log("fetchFollowed is called")
    await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUsername
      })
    }).then((result) => {
      result.json().then((response) => {
        console.log(response);
        if (response.STATUS !== undefined){
          setFollowList([])
        }
        else{
          setFollowList(response)
        }
      });
    });
  };


  const unfollowUser = async (apiURL, currUsername, targetUsername) => {
    console.log("unfollowUser is called")
    await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUsername,
        follow_user: targetUsername
      })
    }).then((result) => {
      result.json().then((response) => {
        console.log(response);
        if (response.STATUS !== undefined){
          alert(response.STATUS)
          if (response.STATUS === 'Removed user from Following'){
            fetchFollowed('http://127.0.0.1:5000/follow/getall', currUsername)
          }
        }
        else{
          alert('Unfollow Failed')
        }
      });
    });
  };

  const viewProfile = (id) => {
    console.log("view profile of user: " + id);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <h2>Users Followed ({followList.length})</h2>
        <Box sx={{overflowY:'auto', height: '40vh'}}>
          <CardContent>
            {followList.map(user => {
              return (
                <Card sx={{marginBottom: 2}}>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe"></Avatar>
                    }
                    title={user.first_name.raw + ' ' + user.last_name.raw}
                  ></CardHeader>
                  <CardActions>
                    <CardContent>
                      <Button onClick={() => navigate(`/userprofile/${user.username.raw}`)} variant="contained" >&nbsp;&nbsp;&nbsp;View &nbsp;&nbsp;</Button> &nbsp;
                      {props.isMyProfile===true &&
                        <Button onClick={() => unfollowUser('http://127.0.0.1:5000/unfollowUser', props.username, user.username.raw)}>unfollow</Button>
                      }
                      </CardContent>
                  </CardActions>
                </Card>
              )
            })}
          </CardContent>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
