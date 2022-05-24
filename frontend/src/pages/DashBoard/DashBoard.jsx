import React, { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { useNavigate } from "react-router-dom"
import { Component } from "react"
import { CardHeader } from "@mui/material"
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import SearchIcon from "@mui/icons-material/Search"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import DashBoardMainCollection from "../../components/DashBoardMainCollection"
import DashBoardRecommendation from "../../components/DashBoardRecommendation"
import SearchBar from '../../components/SearchBar'
import { makeStyles } from "@material-ui/core/styles"
import BackgroundImg from '../../img/dashboardbg.jpg'

const useStyles = makeStyles({
  Title:{
    fontSize: 24,
  },
  btn:{
    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
  }
})

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright ©  COMP9900 Task Master"} {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const borderStyles = {
  boxShadow: "1px 3px 1px #9E9E9E"
}

export default function DashBoard(props) {
  const navigate = useNavigate();
  const isLoggedIn = props.isLoggedIn
  const currUsername = props.currUsername
  const setLoggedIn = props.setLoggedIn
  const setCurrUsername = props.setCurrUsername
  const classes = useStyles("");

  useEffect(() => {
    console.log(localStorage)
    if(localStorage.getItem("isLoggedIn") === 'true' && localStorage.getItem("username").length > 0){
      setLoggedIn(true);
      setCurrUsername(localStorage.getItem("username"));
      console.log("Dashboard: isLoggedIn true")
    }
    else{
      setLoggedIn(false);
      setCurrUsername("");
      console.log("Dashboard: isLoggedIn false")
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar isLoggedIn={isLoggedIn} currUsername={currUsername}/>
      <main>
        <Box sx={{ marginLeft: "30%" }}>
          <SearchBar className={classes} isLoggedIn = {props.isLoggedIn} currUsername = {props.currUsername}/>
        </Box>

        <Box sx={{ flexGrow: 1, marginTop: "50px"}} >
          <Grid container spacing={2}>
            <Grid item xs={11}
            sx={{ border: 1, boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", 
            borderColor: "#ffffff", marginLeft: "auto", marginRight: "auto" }}
            >
              <Container sx={{ py: 4 }}>
                <DashBoardRecommendation
                  navigate = {navigate} isLoggedIn={isLoggedIn} currUsername={currUsername}/>
              </Container>
            </Grid>
          </Grid>
        </Box>
      </main>

      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Book Recommend Platform
        </Typography>
        <Copyright />
      </Box>
    </ThemeProvider>
  );
}
