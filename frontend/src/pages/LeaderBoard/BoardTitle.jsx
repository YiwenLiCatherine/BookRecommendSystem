import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useStyles } from "./LeaderBoard.css.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme();
const styles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "-50px",
};

const BoardTitle = () => {
  const classes = useStyles("");
  return (
    <div>
      <Box
        sx={styles}
      >
        <Typography
          component="h1"
          variant="h5"
          className={classes.LeaderBoardTitle}
        >
          Reading Leader Board
        </Typography>
      </Box>
    </div>
  );
};

export default BoardTitle;
