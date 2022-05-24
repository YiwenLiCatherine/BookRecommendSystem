import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const mycolor = "#386194";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
      contrastText: "#000",
    },
  },
});

function Navbar(props) {
  let navigate = useNavigate();
  let currentPathName = window.location.href;
  let index = currentPathName.lastIndexOf("/");
  currentPathName = currentPathName.substring(
    index + 1,
    currentPathName.length
  );
  const logo = require("../img/logo.png");

  const DashboardButton = () => {
    if (currentPathName !== "") {
      return (
        <Button onClick={toDashboard} size="small">
          Dashboard
        </Button>
      );
    } else {
      return (
        <Button onClick={() => navigate("/collections")} size="small">
          Collections
        </Button>
      );
    }
  };

  const toDashboard = () => {
    navigate("/");
  };

  const logout = () => {
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("username");
    console.log('logout ')
    console.log(localStorage)
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)", width: "100vw" }}
        >
          <Toolbar sx={{ width: "100vw" }}>
            <Box sx={{ flexGrow: 1, float: "left" }}>
              <Box
                sx={{ cursor: "pointer", minWidth: "20vw", maxWidth: "50vw" }}
              >
                <img
                  src={logo}
                  sx={{ height: "80%", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                  alt="go to dashboard"
                />
              </Box>
            </Box>

            <Box sx={{ float: "right" }}>
              {props.isLoggedIn && (
                <>
                  <Button
                    color="inherit"
                    onClick={() =>
                      navigate(`/userprofile/${props.currUsername}`)
                    }
                    size="small"
                  >
                    {" "}
                    <AccountCircle sx={{ marginRight: "5px" }} /> My Profile{" "}
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/collections")}
                    size="small"
                  >
                    {" "}
                    My Collections{" "}
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/leaderboard")}
                    size="small"
                  >
                    {" "}
                    LeaderBoard{" "}
                  </Button>
                  <Button color="inherit" onClick={logout} size="small">
                    {" "}
                    Sign Out{" "}
                  </Button>
                </>
              )}
              {props.isLoggedIn === false && (
                <Button color="inherit" onClick={logout} size="small">
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

export default Navbar;
