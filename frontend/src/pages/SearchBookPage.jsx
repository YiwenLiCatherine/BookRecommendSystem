import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import SearchIcon from "@mui/icons-material/Search"
import Typography from "@mui/material/Typography"
import BookCardCompact from "../components/BookCardCompact"
import Navbar from "../components/Navbar"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import { makeStyles } from '@material-ui/styles'

const theme = createTheme();


const borderStyles = {
  boxShadow: "1px 3px 1px #9E9E9E"
}

const useStyles = makeStyles({
  btn:{
    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
  }
})

export default function SearchBookPage(props) {
  const navigate = useNavigate();
  const classes = useStyles("");

  const isLoggedIn = props.isLoggedIn

  const params = useParams();

  const [keyword, setKeyword] = React.useState('');
  const [books, setBooks] = React.useState([]);
  const [isLoadingBooks, setisLoadingBooks] = React.useState(false);
  const [option, setOption] = React.useState('Book');

  const GoSearchAuthorPage = () => {
    console.log("Go search author");
    setOption('Author');
    navigate('/searchauthor');
  }

  const GoSearchUserPage = () => {
    console.log("Go search user");
    setOption('User');
    navigate('/searchuser');
  }

  const SearchBook = async (keyword) => {
    if (keyword === '') {
      return false;
    } else {
      setisLoadingBooks(true);
      const response = await fetch(`http://127.0.0.1:5000/getbooks/getbookbyname`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: keyword
        }),
      });
      const responseData = await response.json()
      if (response.status === 200) {
        setBooks(responseData.results);
        setisLoadingBooks(false);
        return responseData;
      } else {
        console.log("error");
      }
    }
  };

  useEffect(() => {

    const bookTitleKey = params.bookTitle
    if (bookTitleKey !== undefined) {
      setKeyword(bookTitleKey);
      SearchBook(bookTitleKey);
    }

    console.log(bookTitleKey)
    console.log(keyword)
  }, [params.bookTitle])

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
                    placeholder="search bookname"
                    inputProps={{ "aria-label": "search books" }}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <Button variant="contained" onClick={() => {
                    if (keyword === '') {
                      alert('please input book name')
                    }
                    else {
                      navigate(`/searchbook/${keyword}`);
                    }
                  }}> Search </Button>
                </Paper>

                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="Book" control={<Radio />} label="Book" checked onClick={() => {
                      setOption('Book');
                    }} />
                    <FormControlLabel value="Author" control={<Radio />} label="Author"
                      onClick={GoSearchAuthorPage} />
                    <FormControlLabel value="User" control={<Radio />} label="User"
                      onClick={GoSearchUserPage} />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" sx={{ marginTop: 5 }}>
            {isLoadingBooks &&
              <Typography>Searching your book...</Typography>
            }
            <Grid item>
              {books &&
                <div >
                  <div>
                    {books.map((book, idx) =>
                      <BookCardCompact navigate={navigate} title={book.title.raw} authors={book.authors.raw} book_id={book.book_id.raw} image_url={book.image_url.raw} key={idx} />
                    )}
                  </div>
                </div>
              }
            </Grid>
          </Grid>
        </main>
      </ThemeProvider>
    </>
  );
}
