import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { blueGrey } from "@mui/material/colors";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  btn: {
    background: "linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)",
  },
});

const linecolor = blueGrey[200];

const defaultImg = "https://edit.org/images/cat/book-covers-big-2019101610.jpg";

function BookCard({
  books,
  currUsername,
  setReload,
  setSnackBar,
  setSnackBarContent,
  allowWrite,
}) {
  let navigate = useNavigate();
  const params = useParams();
  const collectionName = params.collectionName;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const classes = useStyles("");

  const deleteBookFromCollection = async () => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(
      `http://127.0.0.1:5000/deletebooksfromcollections`,
      {
        method: "POST",
        headers: {
          // Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: books[0][0],
          username: currUsername,
          collectionname: collectionName,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData.STATUS === "COLLECTION ALREADY EXIXTS") {
      setSnackBarContent(
        `${books[0][2]} has been removed from ${collectionName}`
      );
      setSnackBar(true);
      setReload(true);
    } else {
      alert(`failed to delete ${"bookName"} from ${collectionName}`);
    }
  };

  return (
    <>
      <Grid container sx={{ marginTop: 3 }}>
        <Grid item xs>
          <img
            width="110em"
            src={books[0][1]}
            alt="Book cover"
            onClick={() => navigate(`/book/${books[0][0]}`)}
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
            <Grid item>{books[0][2]}</Grid>
            <Grid item>Author(s): {books[0][3]}</Grid>
            <Grid item>Public year: {books[0][4]}</Grid>
            <Grid item>
              <Rating value={books[0][5]} precision={0.1} readOnly />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container direction="column" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/book/${books[0][0]}`)}
              >
                View
              </Button>
            </Grid>
            {allowWrite && (
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete from collection
                </Button>
                <Dialog
                  open={openDeleteDialog}
                  onClose={() => setOpenDeleteDialog(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle>{`Delete book ${books[0][2]} from ${collectionName}?`}</DialogTitle>
                  <DialogActions>
                    <Button
                      onClick={() => setOpenDeleteDialog(false)}
                    >
                      No
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenDeleteDialog(false);
                        deleteBookFromCollection();
                      }}
                      autoFocus
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <hr
        style={{
          color: linecolor,
        }}
      />
    </>
  );
}

export default BookCard;
