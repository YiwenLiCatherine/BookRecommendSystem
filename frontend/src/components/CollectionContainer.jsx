import React, { useEffect, useState } from "react";
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
import NamedCollectionCard from "../components/NamedCollectionCard";
import SimplePagination from "../components/SimplePagination";
import { Navigate } from "react-router";
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    btn:{
      background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
    }
  })


const theme = createTheme({
  textcolor:'black',
});

function CollectionContainer(props) {
  const username = props.username
  const allowWrite = props.allowWrite
  const classes = useStyles("")

  const [snackBar, setSnackBar] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const [collectionList, setCollectionList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [collectionsPerPage] = useState(6);

  // Get current posts
  const indexOfLastCollection = currentPage * collectionsPerPage;
  const indexOfFirstCollection = indexOfLastCollection - collectionsPerPage;
  const currentCollections = collectionList.slice(
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
    const loadCollections = async () => {
      setIsLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/getcollections`, {
        method: "POST",
        headers: {
          // Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      const responseData = await response.json();
      if (response.status === 200) {
        setIsLoading(false);
        return responseData;
      } else {
        alert("Collection post failed");
      }
    };
    if (reload === false && username !== undefined && username !== '') {
      syncDelay(500);
      loadCollections().then((resData) => {
        const collections = resData;
        const collectionsList = [];
        for (var name in collections) {
          if (collections[name][0] === "EMPTY COLLECTION") {
            let tmp = { collectionName: name, books: [] };
            if (name === "Main Collection") {
              collectionsList.unshift(tmp);
            } else {
              collectionsList.push(tmp);
            }
          } else {
            // console.log(collections[name])
            const booksInfo = []
            for (let index in collections[name]) {
              const bookInfo = collections[name][index]["results"][0];
              const bookID = bookInfo["book_id"]["raw"];
              let bookCover = bookInfo["image_url"]["raw"];
              if (bookInfo["image_url"]["raw"] === "text") {
                bookCover =
                  "https://edit.org/images/cat/book-covers-big-2019101610.jpg";
              }
              booksInfo.push([bookID, bookCover])
            }
            let tmp = { collectionName: name, books: [booksInfo] };
            if (name === "Main Collection") {
              collectionsList.unshift(tmp);
            } else {
              collectionsList.push(tmp);
            }
          }
        }
        setCollectionList(collectionsList);
      });
    }

  }, [reload, props.username]);

  const [collectionName, setCollectionName] = useState("");

  const putCollection = async () => {

    console.log(username)// const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(`http://127.0.0.1:5000//addcollectionsname`, {
      method: "PUT",
      headers: {
        // Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        coldName: collectionName,
      }),
    });
    const responseData = await response.json();
    if (responseData.STATUS === "ADDED") {
      setReload(true);
      setSnackBarContent(`${collectionName} has been added`)
      setSnackBar(true)
    } else {
      alert(responseData.STATUS);
    }
  };

  const addCollection = () => {
    if (collectionName === "") {
      alert("Please fill in your collection name");
      return;
    } else {
      putCollection();
    }
    setCollectionName("");
  };

  return (
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
          <Typography variant="h3">Collections</Typography>
        </Grid>
        <Grid item>
          {allowWrite &&
            <Button onClick={handleClickOpen} variant="contained">
              New Collection
            </Button>
          }
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Enter new collection name</DialogTitle>
            <DialogContent>
              <TextField
                hiddenLabel
                variant="filled"
                value={collectionName}
                onChange={(e) => {
                  setCollectionName(e.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  addCollection();
                  handleClose();
                }}
                variant="outlined"
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <hr/>
      {isLoading &&
        <Typography>Loading the collections...</Typography>
      }
      {currentCollections.map((collection) => (
        <NamedCollectionCard
          currUsername={username}
          name={collection.collectionName}
          books={collection.books}
          setReload={setReload}
          setSnackBar={setSnackBar}
          setSnackBarContent={setSnackBarContent}
          allowWrite={allowWrite}
        ></NamedCollectionCard>
      ))}
      <SimplePagination
        postsPerPage={collectionsPerPage}
        totalPosts={collectionList.length}
        paginate={paginate}
      />
    </Container>
  );
}

export default CollectionContainer;
