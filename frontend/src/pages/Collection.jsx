import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import { CssBaseline, Container, Typography, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SimplePagination from "../components/SimplePagination";
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    btn:{
      background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
    }
  })

const fontcolor = blueGrey[400];

const theme = createTheme();

function Collection(props) {
  const isLoggedIn = props.isLoggedIn
  const currUsername = props.currUsername
  const classes = useStyles("")

  let navigate = useNavigate();
  const params = useParams();
  const collectionName = params.collectionName;
  const location = useLocation().state

  const [snackBar, setSnackBar] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [bookList, setBookList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(6);

  // Get current posts
  const indexOfLastCollection = currentPage * booksPerPage;
  const indexOfFirstCollection = indexOfLastCollection - booksPerPage;
  const currentBooks = bookList.slice(
    indexOfFirstCollection,
    indexOfLastCollection
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // reload stuff
  const [reload, setReload] = useState(false);

  function syncDelay(milliseconds) {
    var start = new Date().getTime();
    var end = 0;
    while (end - start < milliseconds) {
      end = new Date().getTime();
    }
  }

  useEffect(() => {
    setReload((r) => (r ? !r : r)); // no matter it is true or false, turn it to false
    const loadBooks = async () => {
      // const authToken = `Bearer ${localStorage.getItem('token')}`
      const response = await fetch(`http://127.0.0.1:5000/getnamedcollection`, {
        method: "POST",
        headers: {
          // Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: location.currUsername,
          collectionname: collectionName,
        }),
      });
      const responseData = await response.json();
      if (response.status === 200) {
        return responseData;
      } else {
        alert("Get collection post failed");
      }
    };
    if (reload === false) {
      syncDelay(500);
      loadBooks().then((resData) => {
        const books = resData[collectionName];
        const books_list = [];
        console.log(books)
        if (books[0] !== "EMPTY COLLECTION") {
          for (let index in books) {
          // console.log(books[index]["results"][0])
          const book = books[index]["results"][0];
          const book_id = book["book_id"]["raw"];
          let book_cover = book["image_url"]["raw"];
          const book_name = book["original_title"]["raw"];
          const author = book["authors"]["raw"];
          const rating = book["average_rating"]["raw"];
          const public_year = book["original_publication_year"]["raw"];
          if (book["image_url"]["raw"] === "text") {
            book_cover =
              "https://edit.org/images/cat/book-covers-big-2019101610.jpg";
          }
          const book_info = [
            book_id,
            book_cover,
            book_name,
            author,
            public_year,
            rating,
          ];
          // console.log(book_info);
          let tmp = { collectionName: collectionName, info: [book_info] };
          books_list.push(tmp);
        }
        }
        setBookList(books_list);
      });
    }
  }, [reload]);

  return (
    <ThemeProvider theme={theme}>
      <Navbar isLoggedIn={isLoggedIn} currUsername={currUsername}/>
      <CssBaseline />
      <Container
        sx={{
          marginTop: 7,
          padding: 5,
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackBar}
          autoHideDuration={5000}
          onClose={() => setSnackBar(false)}
        >
          <Alert
            onClose={() => setSnackBar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackBarContent}
          </Alert>
        </Snackbar>
        <Grid container justifyContent="space-between" alignItems="flex-end">
          <Grid item>
            <Typography variant="h4">{collectionName}</Typography>
          </Grid>
          <Grid item>
            {location.allowWrite ? (
              <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/collections")}
            >
              Back to collections
            </Button>
            ) : (
              <Button
              size="large"
              variant="contained"
              onClick={() => navigate(`/userprofile/${location.currUsername}`)}
            >
              Back to profile
            </Button>
            )

            }
          </Grid>
        </Grid>
        {currentBooks.length !== 0 ? (
          currentBooks.map((book) => (
            <BookCard
              books={book.info}
              currUsername={currUsername}
              setReload={setReload}
              setSnackBar={setSnackBar}
              setSnackBarContent={setSnackBarContent}
              allowWrite={location.allowWrite}
            />
          ))
        ) : (
          <div style={{ "padding-top": "30px" }}>
            <Typography variant="h6">
              {" "}
              There is no book in {collectionName}
            </Typography>
          </div>
        )}
        <SimplePagination
          postsPerPage={booksPerPage}
          totalPosts={bookList.length}
          paginate={paginate}
        />
      </Container>
    </ThemeProvider>
  );
}

export default Collection;
