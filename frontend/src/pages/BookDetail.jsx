import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import SimplePagination from '../components/SimplePagination'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { blueGrey } from '@mui/material/colors'
import Navbar from '../components/Navbar'
import BookInfo from '../components/BookInfo'
import ReviewCard from '../components/ReviewCard'
import { makeStyles } from '@material-ui/styles'

const fontcolor = blueGrey[400]

const theme = createTheme();

const useStyles = makeStyles({
  Title:{
    fontSize: 24,
  },
  btn:{
    background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
  }
})

function BookDetail(props) {
  const isLoggedIn = props.isLoggedIn
  const currUsername = props.currUsername
  const classes = useStyles("");

  const params = useParams()
  const bookId = params.bookId

  const [reviewList, setReviewList] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentReviews = reviewList.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // reload stuff
  const [reload, setReload] = useState(false)

  function syncDelay(milliseconds) {
    var start = new Date().getTime();
    var end = 0;
    while ((end - start) < milliseconds) {
      end = new Date().getTime();
    }
  }

  useEffect(() => {
    setReload(r => r ? !r : r); // no matter it is true or false, turn it to false
    const loadReview = async () => {
      const response = await fetch(`http://127.0.0.1:5000/getbooks/getbookbyid?book_id=${bookId}`, {
        method: 'POST',
        headers: {
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
      // stupid way to wait until the database already update
      syncDelay(500)
      loadReview()
        .then((resData) => {
          const comments = resData["comments"]["raw"]
          const comment_list = []
          for (let i = 0; i < comments.length; i++) {
            let username = comments[i].split("\"")[1]
            let reviewtext = comments[i].split("\"")[3]
            let tmp = { userName: username, reviewText: reviewtext }
            comment_list.push(tmp)
          }
          setReviewList(comment_list)
        })
    }
  }, [reload]);


  // New review content
  const [reviewContent, setReviewContent] = useState("")

  const putReview = async () => {
    const response = await fetch(`http://127.0.0.1:5000/addcomments`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book_id: parseInt(bookId),
        username: currUsername,
        comment: reviewContent,
      })
    })
    const responseData = await response.json()
    if (responseData.STATUS === 'ADDED') {
      setReload(true)
    } else {
      alert("comment post failed")
    }
  }

  const addReview = () => {
    if (reviewContent === "") {
      alert("Please fill in your review")
      return
    } else {
      putReview()
    }
    setReviewContent("")
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar isLoggedIn={isLoggedIn} />
      <CssBaseline />
      <Container sx={{
        marginTop: 7,
        padding: 5
      }}>
        <BookInfo Id={bookId} currUsername={currUsername} isLoggedIn={isLoggedIn}/>
        {/* review box  */}
        <Typography
          variant="h6"
          style={{
            color: fontcolor,
          }}
        >
          Reviews from readers
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, marginTop: 2 }}>
          {(() => {
            if (currentReviews.length === 0) {
              return <div>This Book has no comment</div>;
            }
          })()}
          {currentReviews.map(review => (
            <ReviewCard
              currUsername={currUsername}
              userName={review.userName}
              reviewText={review.reviewText}
              setReload={setReload}
            >
            </ReviewCard>
          ))}
          <SimplePagination
            postsPerPage={postsPerPage}
            totalPosts={reviewList.length}
            paginate={paginate}
          />
        </Paper>
        {/* review textbox */}
        <Typography
          variant="h6"
          sx={{
            color: fontcolor,
            marginTop: 2
          }}
        >
          Review
        </Typography>
        <TextField
          label="write your review here"
          multiline
          rows={4}
          sx={{
            marginBottom: 2,
            width: 1
          }}
          value={reviewContent}
          onChange={(e) => {
            setReviewContent(e.target.value);
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'right',
            justifyContent: 'right',
          }}
        >
          {isLoggedIn===true &&
            <Button onClick={addReview} variant="outlined"> review </Button>
          }
        </div>
      </Container>
    </ThemeProvider >
  );
}

export default BookDetail