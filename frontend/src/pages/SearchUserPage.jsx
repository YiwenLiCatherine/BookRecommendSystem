import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import SearchIcon from "@mui/icons-material/Search"
import Typography from "@mui/material/Typography"
import BookContainer from "../components/BookContainer"
import Navbar from "../components/Navbar"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import UserInfoCompact from "../components/UserInfoCompact"
import { makeStyles } from '@material-ui/styles'


const theme = createTheme();

const commonStyles = {
  borderColor: "text.primrary",
};

const borderStyles = {
  boxShadow: "1px 3px 1px #9E9E9E",
};


export default function SearchUserPage(props) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = React.useState("");
  const [users, setUsers] = React.useState("");
  const [isLoadingUsers, setisLoadingUsers] = React.useState(false);
  const [option, setOption] = React.useState("User");

  const isLoggedIn = props.isLoggedIn;

  const params = useParams();

  const GoSearchBookPage = () => {
    setOption("Book");
    navigate("/searchbook");
  };

  const GoSearchAuthorPage = () => {
    setOption("Author");
    navigate("/searchauthor");
  };

  const SearchUser = async (keyword) => {
    if (keyword === "") {
      return false;
    } else {
      setisLoadingUsers(true);
      const response = await fetch(
        `http://127.0.0.1:5000/getuser/getuserbyusername`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: keyword,
          }),
        }
      );
      const responseData = await response.json()
      if (response.status === 200) {
        setisLoadingUsers(false);
        setUsers(responseData.results);
        return;
      } else {
        setisLoadingUsers(false);
        console.log("Did not find the user in database");
      }
    }
  };

  useEffect(() => {
    const usernameKey = params.username;
    if (usernameKey !== undefined) {
      setKeyword(usernameKey);
      SearchUser(usernameKey);
    }
  }, [params.username]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar isLoggedIn={isLoggedIn} />

        <main>
          <Grid container>
            <Grid item xs>
              <Box sx={{ marginLeft: "30%" }}>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "60%",
                    height: "60px",
                    marginTop: "100px",
                  }}
                >
                  <SearchIcon />
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="search user"
                    inputProps={{ "aria-label": "search books" }}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (keyword === "") {
                        alert("Please input user name");
                      } else {
                        navigate(`/searchuser/${keyword}`);
                      }
                    }}
                  >
                    {" "}
                    Search{" "}
                  </Button>
                </Paper>

                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="Book"
                      control={<Radio />}
                      label="Book"
                      onClick={GoSearchBookPage}
                    />
                    <FormControlLabel
                      value="Author"
                      control={<Radio />}
                      label="Author"
                      onClick={GoSearchAuthorPage}
                    />
                    <FormControlLabel
                      value="User"
                      control={<Radio />}
                      checked
                      label="User"
                      onClick={() => {
                        setOption("User");
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" sx={{ marginTop: 5 }}>
            {isLoadingUsers && <Typography>Searching the users...</Typography>}
            <Grid item>
              {users && (
                <div>
                  <div>
                    {users.map(user => (
                      <UserInfoCompact
                      email={user.email.raw}
                      username={user.username.raw}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        </main>
      </ThemeProvider>
    </>
  );
}
