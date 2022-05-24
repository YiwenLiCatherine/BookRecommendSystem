import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Rating from '@mui/material/Rating'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { blueGrey } from '@mui/material/colors'
import BookInfoAddToCollectionDialog from '../components/BookInfoAddToCollectionDialog'
import { makeStyles } from '@material-ui/styles'

const linecolor = blueGrey[200]
const fontcolor = blueGrey[400]

const defaultImg = "https://edit.org/images/cat/book-covers-big-2019101610.jpg"

const useStyles = makeStyles({
  btn:{
    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
  },
  text: {
    color: '#030052',
    fontSize:"20px",
  },
  title: {
    fontSize:"30px",
  }
})

function BookInfo(props) {
  const [reload, setReload] = useState(false)
  const [bookName, setBookName] = useState('bookname')
  const [authorName, setAuthorName] = useState('authorname')
  const [ISBN, setISBN] = useState(0)
  const [publicDate, setPublicDate] = useState('public date')
  const [rate, setRate] = useState(3)
  const [url, setUrl] = useState(defaultImg)
  const [myRate, setMyRate] = useState(rate)
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [readerNum, setReaderNum] = useState(0)
  const [snackBar, setSnackBar] = useState(false)
  const [snackBarContent, setSnackBarContent] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const classes = useStyles("")


  const handleClickOpen = () => {
    setOpenRateDialog(true);
  };

  const handleClose = () => {
    setOpenRateDialog(false);
  };

  const postRate = async () => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(`http://127.0.0.1:5000/addrating`, {
      method: 'PUT',
      headers: {
        // Authorization: authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book_id: parseInt(props.Id),
        username: props.currUsername,
        rating: myRate,
      })
    })
    const responseData = await response.json();
    if (responseData.STATUS === "ADDED") {
      setReload(true)
    } else {
      alert("update rate failed")
    }
  }

  const submitRate = () => {
    postRate()
    setOpenRateDialog(false)
    setSnackBarContent("You have rated this book. Thank you for your contribution!")
    setSnackBar(true)
  }

  useEffect(() => {
    setReload(r => r ? !r : r); // no matter it is true or false, turn it to false
    const loadInfo = async () => {
      // const authToken = `Bearer ${localStorage.getItem('token')}`
      const response = await fetch(`http://127.0.0.1:5000/getbooks/getbookbyid?book_id=${props.Id}`, {
        method: 'POST',
        headers: {
          // Authorization: authToken,
          'Content-Type': 'application/json'
        }
      })
      const responseData = await response.json()
      if (response.status === 200) {
        return responseData.results[0];
      } else {
        return undefined
      }
    }

    // at this moment effect will be triggered twice as reload: false -> true -> false
    // So only request once to avoid waste
    if (reload === false) {
      loadInfo()
        .then((resData) => {
          setAuthorName(resData["authors"]["raw"])
          setBookName(resData["original_title"]["raw"])
          setISBN(resData["isbn"]["raw"])
          setPublicDate(resData["original_publication_year"]["raw"])
          setRate(resData["average_rating"]["raw"])
          if (resData["image_url"]["raw"] !== "text") {
            setUrl(resData["image_url"]["raw"])
          } else {
            setUrl(defaultImg)
          }
        })
    }
  }, [reload]);


  // Collection button
  const collectionButton = () => {
    setDialogOpen(true)
  }

  const readButton = () => {
    alert('This function has not been implemented')
  }

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            {bookName}
          </Typography>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
      <hr style={{
        color: linecolor
      }} />
      {/* book info */}
      <Grid container sx={{ marginTop: 3 }}>
        <Grid item xs>
          <img width="110em"
            src={url}
            alt="Book cover"
          />
        </Grid>
        <Grid item xs={7}>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item className={classes.text}>
              Author(s): {authorName}
            </Grid>
            <Grid item className={classes.text}>
              ISBN: {ISBN}
            </Grid>
            <Grid item className={classes.text}>
              Public year: {publicDate}
            </Grid>
            <Grid item className={classes.text}>
              <Tooltip title={"Average rate: " + rate}>
                <Typography onClick={handleClickOpen} style={{ cursor: "pointer" }}>Rate</Typography>
              </Tooltip>
              <Rating value={rate} precision={0.1} readOnly />
              <Dialog
                open={openRateDialog}
                onClose={handleClose}
              >
                <DialogTitle className={classes.text} >
                  Rate
                </DialogTitle>
                <DialogContent>
                  <Rating
                    value={myRate}
                    onChange={(event, newRate) => {
                      setMyRate(newRate);
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={submitRate}>Submit</Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackBar}
                autoHideDuration={5000}
                onClose={() => setSnackBar(false)}
              >
                <Alert onClose={() => setSnackBar(false)} severity="success" sx={{ width: '100%' }}>
                  {snackBarContent}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid
            container
            direction="column"
            alignItems="flex-end"
            spacing={2}
          >
            <Grid item>
              {props.isLoggedIn===true &&
                <Button
                  variant="outlined"
                  size="small"
                  onClick={collectionButton}
                >
                  Add to Collection
                </Button>
              }
            </Grid>
            <BookInfoAddToCollectionDialog
              bookName={bookName}
              currUsername={props.currUsername}
              open={dialogOpen}
              setOpen={setDialogOpen}
              setSnackBar={setSnackBar}
              setSnackBarContent={setSnackBarContent}
            />
            <Grid item>
              {props.isLoggedIn===true &&
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClickOpen}
                >
                  Rate this book
                </Button>
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <Typography
        variant="h6"
        style={{
          color: fontcolor,
          'margin-top': '5px'
        }}
      >
        Description
      </Typography>
      <Typography variant="body1" gutterBottom align='justify'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
        neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
        quasi quidem quibusdam.
      </Typography> */}
    </>
  );
}

export default BookInfo