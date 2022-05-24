import React, { useState, useEffect } from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Book from "../img/book.jpg"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useStyles } from "../pages/LeaderBoard/LeaderBoard.css"
import { makeStyles } from "@material-ui/core/styles"
import CssBaseline from "@mui/material/CssBaseline";


const theme = createTheme();

const LeaderBoardUserCard = (props) => {
    const classes = useStyles("");
    const isLoggedIn = props.isLoggedIn
    const currUsername = props.currUsername
    const [userStatus, setUseStatus] = useState('0');

    useEffect(() => {
        console.log("see current user");
        console.log(isLoggedIn, currUsername);
        if (props.isLoggedIn === true && props.currUsername !== null && props.currUsername !== ""){
            setUseStatus(1);
            fetchUserScore("http://127.0.0.1:5000/correstscore", props.currUsername);
        }
        else{
            console.log('login to see score');
        }
      }, [props.isLoggedIn, props.currUsername]);

      const fetchUserScore = async (apiURL, currUsername) => {
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
            console.log(response.data);
          });
        });
      };


  return (
    <div>
    <CssBaseline />
      <Card>
        <CardHeader
          className={classes.title}
          title="Your Monthly Reading Behavior"
        />
        <CardMedia component="img" height="200" width="200" image={Book} />
        <CardContent>
          <Typography>During last month, you have got: </Typography>
          <Typography textAlign="center">xxx</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderBoardUserCard;
