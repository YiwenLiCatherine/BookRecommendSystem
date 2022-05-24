import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from '@material-ui/styles'


const linecolor = blueGrey[200];
const fontcolor = blueGrey[400];

const theme = createTheme({
  palette: {
    primary: {
      main: fontcolor,
      contrastText: "#000",
    },
  },
});

const useStyles = makeStyles({
  btn:{
    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
  }
})

const BookCardCompact = (props) => {
  let navigate = useNavigate();
  const classes = useStyles("");

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{
        width: {
          xs: 500,
          sm: 600,
          md: 700,
          lg: 800,
          xl: 900,
        },
        marginTop: 3
      }}>
        <Grid item xs={3}>
          <img
            width="110em"
            src={props.image_url}
            alt="Book cover"
            onClick={() => navigate(`/book/${props.book_id}`)}
            style={{
              cursor: "pointer",
            }}
            sx={{
              marginLeft: 2,
            }}
          />
        </Grid>
        <Grid item xs={7}>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item>
              <Typography gutterBottom variant="h6" component="h4" style={{ fontSize: '12pt', fontWeight: 'bold' }}>
                {props.title}
              </Typography>
            </Grid>
            <Grid item>{props.authors}</Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container direction="column" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/book/${props.book_id}`)}
              >
                Detail
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <hr
        style={{
          color: linecolor,
        }}
      />
    </ThemeProvider>
  );
}

export default BookCardCompact;