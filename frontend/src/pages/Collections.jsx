import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import Navbar from "../components/Navbar";
import MainCollectionCard from "../components/MainCollectionCard";
import NamedCollectoinCard from "../components/NamedCollectionCard";
import SimplePagination from "../components/SimplePagination";
import { Navigate } from "react-router";
import CollectionContainer from "../components/CollectionContainer";


const theme = createTheme({
  textcolor:'black',
});

function Collections(props) {

  return (
    <ThemeProvider theme={theme}>
      <Navbar isLoggedIn={props.isLoggedIn} currUsername={props.currUsername}/>
      <CssBaseline />
      <CollectionContainer username={props.currUsername} allowWrite={true}></CollectionContainer>
    </ThemeProvider>
  );
}

export default Collections;
