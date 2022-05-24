import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import ReadingTable from "../../components/ReadingTable";
import { useStyles } from "./LeaderBoard.css.js";
import BoardTitle from "./BoardTitle";
import LeaderBoardUserCard from "../../components/LeaderBoardUserCard"
import icon from '../../img/leaderboardIcon.png'

const Copyright = (props) => (
  <Typography variant="body2" color="text.secondary" align="center" {...props}>
    {"Copyright © "}
    <Link color="inherit">Task Master</Link> {new Date().getFullYear()}
    {"."}
  </Typography>
);


const theme = createTheme();

const LeaderBoard = (props) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [readDate, setDate] = React.useState([null, null]);
  const [userName, setUserName] = useState("");
  const [score, setScore] = React.useState();
  const classes = useStyles("");

  console.log(props.currUsername);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Navbar isLoggedIn={props.isLoggedIn} currUsername={props.currUsername}/>
        <main>
          <Box sx={{ flexDirection: 'row' }}>
            <img src={icon} className={classes.icon}/>
            <BoardTitle />
          </Box>



          <Box sx={{ flexGrow: 1, marginTop: "50px" }}>
            {" "}
            <Card width="800" style={{    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)'}}>
              <CardHeader className={classes.title} title="High Score"/>
              <CardContent>
                <ReadingTable />
              </CardContent>
            </Card>
          </Box>
        </main>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default LeaderBoard;
