import React, { useState } from "react";
import { Grid, Button, TextField, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  btn:{
    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
  }, 
  text: {
    color:'#2b24e3',
  }
})


const ManipulateReviewCard = ({
  currUsername,
  username,
  text,
  openDialog,
  setOpenDialog,
  setReload,
}) => {
  const [newText, setNewText] = useState("");
  const params = useParams();
  const bookId = params.bookId;
  const classes = useStyles("");

  const deleteReview = async () => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(`http://127.0.0.1:5000/deletecomments`, {
      method: "PUT",
      headers: {
        // Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: parseInt(bookId),
        username: currUsername,
        comment: text,
      }),
    });
    const responseData = await response.json();
    if (responseData.STATUS[0].errors.length === 0) {
      setReload(true);
    } else {
      alert("failed to delete the comment");
    }
  };

  const editReview = async () => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(`http://127.0.0.1:5000/editcomments`, {
      method: "PUT",
      headers: {
        // Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: parseInt(bookId),
        username: currUsername,
        new_comment: newText,
        old_comment: text
      }),
    });
    const responseData = await response.json();
    if (response.status === 200) {
      setReload(true);
    } else {
      alert("failed to edit the comment");
    }
  };

  // if it equals to current user ID. User can edit this comment
  if (username === currUsername) {
    return (
      <>
        <Button
          variant="outlined"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          edit
        </Button> &nbsp;
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
          }}
        >
          <DialogTitle>Edit your review</DialogTitle>
          <Box
            sx={{
              "& > :not(style)": {
                width: 600,
              },
            }}
          >
            <DialogContent>
              <TextField
                multiline
                rows={4}
                defaultValue={text}
                onChange={(e) => setNewText(e.target.value)}
                sx={{
                  width: 1,
                }}
              />
            </DialogContent>
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                editReview()
                setOpenDialog(false);
              }}
              variant="outlined"
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
        <Button onClick={deleteReview} variant="outlined">delete</Button>
      </>
    );
  } else {
    return <></>;
  }
};

function ReviewCard(props) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <h4 style={{ margin: 0, textAlign: "left" }}>{props.userName}</h4>
        <p style={{ textAlign: "left" }}>{props.reviewText}</p>
      </Grid>
      <Grid item>
        <ManipulateReviewCard
          currUsername={props.currUsername}
          username={props.userName}
          text={props.reviewText}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          setReload={props.setReload}
        />
      </Grid>
    </Grid>
  );
}
ReviewCard.propTypes = {
  userName: PropTypes.string,
  reviewText: PropTypes.string,
};
export default ReviewCard;
