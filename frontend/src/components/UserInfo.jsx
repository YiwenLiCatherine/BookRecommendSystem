import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Grid from '@mui/material/Grid'
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    btn:{
      background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
    }
  })

export default function UserInfo(props) {
  const navigate = useNavigate();
  const classes = useStyles("");

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [username, setUsername] = useState('UserName');
  const [name, setName] = useState('Name');
  const [email, setEmail] = useState('example@example.com')
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {

    fetchUserProfile('http://127.0.0.1:5000/getuser', props.username)
    checkFollow('http://127.0.0.1:5000/checkFollow', props.currUsername, props.username)

  }, [props.currUsername, props.username])

  const fetchUserProfile = async (apiURL, currUsername) => {
    console.log("fetchUserProfile is called")
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
        if (response.results !== undefined && response.results.length > 0) {
          if (response.results[0].email !== undefined && response.results[0].email.raw !== undefined) {
            setEmail(response.results[0].email.raw)
          }
          if (response.results[0].username !== undefined && response.results[0].username.raw !== undefined) {
            setUsername(response.results[0].username.raw)
          }
          if (response.results[0].first_name !== undefined && response.results[0].first_name.raw !== undefined &&
            response.results[0].last_name !== undefined && response.results[0].last_name.raw !== undefined) {
            setName(response.results[0].first_name.raw + ' ' + response.results[0].last_name.raw)
          }
        }
        else {
          setName("user not found")
        }
        setIsLoadingProfile(false);
      });
    });
  };

  const checkFollow = async (apiURL, currUsername, targetUsername) => {
    console.log("checkFollow is called")
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
          if (response.STATUS === 'Followed'){
            setIsFollowed(true)
          }
          else{
            setIsFollowed(false)
          }
        }
      });
    });
  };


  const followUser = async (apiURL, currUsername, targetUsername) => {
    console.log("followUser is called")
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
          if (response.STATUS === 'FOLLOWED'){
            checkFollow('http://127.0.0.1:5000/checkFollow', props.currUsername, props.username)
          }
        }
        else{
          alert('Follow Failed')
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
            checkFollow('http://127.0.0.1:5000/checkFollow', props.currUsername, props.username)
          }
        }
        else{
          alert('Unfollow Failed')
        }
      });
    });
  };

  return (
    <>
      <Card sx={{height: '48.5vh'}}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe">
            </Avatar>
          }
          cl
          title={username}
        />
        <CardContent>
          {props.isMyProfile &&
            <Typography variant="body2" color="text.secondary">
              email address:  {email}
            </Typography>
          }
          <Typography paragraph><h2>{name}</h2></Typography>
          {props.isMyProfile === false &&
            <Box sx={{marginRight: 'auto', marginLeft: 'auto', textAlign: 'center'}}>
              { isFollowed === false &&
                <Button variant='contained' onClick={() => followUser('http://127.0.0.1:5000/followUser', props.currUsername, username)}>Follow</Button>
              }
              { isFollowed === true &&
                <>
                  <Typography>You are following {name}</Typography>
                  <Button variant='outlined' onClick={() => unfollowUser('http://127.0.0.1:5000/unfollowUser', props.currUsername, username)}>Unfollow</Button>
                </>
              }
            </Box>
          }
        </CardContent>
      </Card>
    </>
  );
}
