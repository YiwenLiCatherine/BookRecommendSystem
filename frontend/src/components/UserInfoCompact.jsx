import React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { blueGrey } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { makeStyles } from '@material-ui/styles'


const theme = createTheme({
  textcolor: "black",
});

const useStyles = makeStyles({
  btn:{
    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
  },
})

// Used in SearchUserPage.jsx as one of
// the search result of user

export default function UserInfoCompact(props) {
  const navigate = useNavigate();
  const classes = useStyles("");

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          width: {
            xs: 500,
            sm: 600,
            md: 700,
            lg: 800,
            xl: 900,
          },
          marginBottom: 2,
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"  
        >
          <Grid item>
            <CardHeader
              avatar={<Avatar aria-label="recipe" />}
              title={props.username}
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate(`/userprofile/${props.username}`)}
            />
          </Grid>
          <Grid item>
            <Button size={"small"} onClick={() => navigate(`/userprofile/${props.username}`)}>
              view
            </Button>
          </Grid>
        </Grid>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            email address: {props.email}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
