import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import { blueGrey } from "@mui/material/colors";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  btn: {
    background: "linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)",
  },
});

function NamedCollectionCard({
  currUsername,
  name,
  books,
  setReload,
  setSnackBar,
  setSnackBarContent,
  allowWrite,
}) {
  let navigate = useNavigate();
  const [newName, setNewName] = useState(name);
  const classes = useStyles("");

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  let bookList = [];
  if (books[0] !== undefined) {
    bookList = books[0];
  }

  function BookCoversList(list) {
    return (
      <>
        {list.length > 0 &&
          list.map((book) => (
            <Grid item>
              <img
                width="110em"
                src={book[1]}
                alt=""
                style={{
                  cursor: "pointer",
                  margin: "15px",
                }}
                onClick={() => navigate(`/book/${book[0]}`)}
              />
            </Grid>
          ))}
        {(list === undefined || list.length === 0) && (
          <Typography
            sx={{
              marginLeft: 2,
              marginTop: 1,
            }}
          >
            (No book in this collection)
          </Typography>
        )}
      </>
    );
  }

  const deleteCollection = async () => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(
      `http://127.0.0.1:5000/deletecompletecollections`,
      {
        method: "POST",
        headers: {
          // Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currUsername,
          collectionname: name,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData.STATUS === "COLLECTIONS Deleted") {
      setReload(true);
      setOpenDeleteDialog(false);
      setSnackBarContent(`${name} has been deleted`);
      setSnackBar(true);
    } else {
      alert("failed to delete the collection");
    }
  };

  const putCollectionName = async () => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(
      `http://127.0.0.1:5000/changecollectionsname`,
      {
        method: "PUT",
        headers: {
          // Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currUsername,
          coldName: name,
          cnewName: newName,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData.STATUS === "COLLECTIONS NAME CHANGED") {
      console.log("GO HERE")
      setReload(true);
      setSnackBar(true);
      setSnackBarContent(`Successfully change the collection name`);
    } else {
      alert(responseData.STATUS);
    }
  };

  const editCollectionName = () => {
    if (newName === "") {
      alert("Please fill in your new collection name");
      return;
    } else {
      putCollectionName()
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          width: 1,
          height: 250,
        },
        paddingBottom: 2,
      }}
    >
      <Paper elevation={4}>
        <Grid container justifyContent="space-between" alignItems="flex-end">
          <Grid item>
            <Typography
              variant="h6"
              style={{
                "margin-left": "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(`/collection/${name}`, {
                  state: { currUsername: currUsername, allowWrite: allowWrite },
                });
              }}
            >
              {name}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => {
                navigate(`/collection/${name}`, {
                  state: { currUsername: currUsername, allowWrite: allowWrite },
                });
              }}
            >
              View
            </Button>
            &nbsp;
            {(() => {
              if (name !== "Main Collection") {
                return (
                  <>
                    {allowWrite && (
                      <Button
                        variant="text"
                        onClick={() => setOpenEditDialog(true)}
                      >
                        Edit
                      </Button>
                    )}
                    &nbsp;
                    <Dialog
                      open={openEditDialog}
                      onClose={() => setOpenEditDialog(false)}
                    >
                      <DialogTitle>Edit your collection name</DialogTitle>
                      <DialogContent>
                        <TextField
                          hiddenLabel
                          variant="filled"
                          defaultValue={name}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            editCollectionName();
                            setOpenEditDialog(false);
                          }}
                        >
                          Edit
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {allowWrite && (
                      <Button
                        variant="text"
                        onClick={() => setOpenDeleteDialog(true)}
                      >
                        Delete
                      </Button>
                    )}
                    &nbsp;
                    <Dialog
                      open={openDeleteDialog}
                      onClose={() => setOpenDeleteDialog(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle>{`Delete collection ${name}?`}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Once you delete this collection, every book in this
                          collection will be deleted as well.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenDeleteDialog(false)}
                        >
                          No
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={deleteCollection}
                          autoFocus
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                );
              }
            })()}
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          {bookList.length >= 7
            ? BookCoversList(bookList.slice(0, 7))
            : BookCoversList(bookList)}
          {bookList.length >= 7 ? (
            <Grid item>
              <IconButton
                variant="outlined"
                sx={{
                  marginLeft: 3,
                }}
                onClick={() => {
                  navigate(`/collection/${name}`, { state: { currUsername, allowWrite } })
                }}
              >
                <MoreHorizIcon color="primary" fontSize="large" />
              </IconButton>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Paper>
    </Box>
  );
}

export default NamedCollectionCard;
