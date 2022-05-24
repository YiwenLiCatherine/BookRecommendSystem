import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardHeader, CardContent, CardActions, CardMedia, Button, Paper, Typography } from "@mui/material"
import BookContainer from "./BookContainer";


const bookListStyle = { width: "75vw", overflowX: "auto", display: "flex"}


function DashBoardRecommendation(props) {
  let navigate = props.navigate;

  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  const [userBasedBooks, setUserBasedBooks] = useState([]);
  const [isLoadingUserBased, setIsLoadingUserBased] = useState(true);

  const [contentBasedBooks, setContentBasedBooks] = useState({});
  const [isLoadingContentBased, setIsLoadingContentBased] = useState(true);

  const [mainCollection, setMainCollection] = useState([]);
  const [isLoadingMainCollection, setIsLoadingMainCollection] = useState(true);

  useEffect(() => {
    console.log(props.isLoggedIn, props.currUsername)
    if (props.isLoggedIn === true && props.currUsername !== null && props.currUsername !== ""){
      fetchFeaturedLoggedIn("http://127.0.0.1:5000/getbooks/featured", props.currUsername);
      fetchContentBased("http://127.0.0.1:5000/getrecommendation/content-based-recomendation", props.currUsername);
      fetchUserBased("http://127.0.0.1:5000/getCCrecommendation/", props.currUsername);
      fetchMainCollection("http://127.0.0.1:5000/getmaincollection/", props.currUsername);
    }
    else{
      fetchFeatured("http://127.0.0.1:5000/getbooks/welcomepage");
    }
  }, [props.isLoggedIn, props.currUsername]);

  const fetchFeatured = async (apiURL) => {
    await fetch(apiURL, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    }).then((result) => {
      result.json().then((response) => {
        console.log(response.data);
        setFeaturedBooks(response);
        setIsLoadingFeatured(false);
      });
    });
  };

  const fetchFeaturedLoggedIn = async (apiURL, currUsername) => {
    console.log("fetchFeaturedLoggedIn is called")
    await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUsername
      })
    }).then((result) => {
      result.json().then((response) => {
        console.log(response.data);
        setFeaturedBooks(response);
        setIsLoadingFeatured(false);
      });
    });
  };

  const fetchContentBased = async (apiURL, currUsername) => {
    console.log("fetchContentBased is called")
    await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUsername
      })
    }).then((result) => {
      result.json().then((response) => {
        console.log(response);
        setContentBasedBooks(response);
        setIsLoadingContentBased(false);
      });
    });
  };

  const fetchUserBased = async (apiURL, currUsername) => {
    console.log("fetchUserBased is called")
    await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUsername
      })
    }).then((result) => {
      result.json().then((response) => {
        console.log(response.data);
        setUserBasedBooks(response);
        setIsLoadingUserBased(false);
      });
    });
  };

  const fetchMainCollection = async (apiURL, currUsername) => {
    console.log("fetchMainCollection is called")
    await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currUsername
      })
    }).then((result) => {
      result.json().then((response) => {
        console.log(response["Main Collection"])
        if(response["Main Collection"] !== undefined || response["Main Collection"] !== [["EMPTY COLLECTION"]]){
          setMainCollection(response["Main Collection"]);
        }
        setIsLoadingMainCollection(false);
      });
    });
  };


  return (
    <Grid container spacing={2} style={{width:"100%", overflowX:'auto'}}>
        
        { props.isLoggedIn && (isLoadingUserBased === true || isLoadingFeatured === true || isLoadingContentBased === true) &&
            <div style={{marginTop: '20px'}}>
              <Typography variant="h6">Loading Recommendations...  Please Wait</Typography>
            </div>
        }


        {contentBasedBooks &&
        isLoadingContentBased === false &&

          Object.entries(contentBasedBooks)
          .map( ([key, value]) => 
            <>
              {contentBasedBooks[key][0] &&
                <div style={{marginTop: '20px'}} key={key}>
                  <Typography variant="h5">Because You Liked {key}</Typography>
                  <div style={bookListStyle}>
                    {contentBasedBooks[key].map((book, idx) => 
                      <BookContainer navigate={navigate} title={book.title} authors={book.authors} book_id={book.book_id} image_url={book.image_url} key={idx}/>
                    )}
                  </div>
                </div>
              }
            </>
          )
        }

        {userBasedBooks &&
        isLoadingUserBased === false &&
        userBasedBooks.length > 0 && 
          <div style={{marginTop: '20px'}}>
            <Typography variant="h5">Users Like You Also Like</Typography>
            <div style={bookListStyle}>
              {userBasedBooks.map((book, idx) => 
                <BookContainer navigate={navigate} title={book.title} authors={book.authors} book_id={book.book_id} image_url={book.image_url} key={idx}/>
              )}
            </div>
          </div>
        }


        {featuredBooks &&
        isLoadingFeatured === false &&
        
          <div style={{marginTop: '20px'}}>
            <Typography variant="h5">Featured Books</Typography>
            <div style={bookListStyle}>
              {featuredBooks.map((book, idx) => 
                <BookContainer navigate={navigate} title={book.title.raw} authors={book.authors.raw} book_id={book.book_id.raw} image_url={book.image_url.raw} key={idx}/>
              )}
            </div>
          </div>
        }

        {mainCollection &&
        isLoadingMainCollection === false &&
        mainCollection.length > 0 && 
        mainCollection !== ["EMPTY COLLECTION"] &&
          <div style={{marginTop: '20px'}}>
            <Typography variant="h5">Your Main Collection</Typography>
            <div style={bookListStyle}>
              {mainCollection.map((book, idx) => 
                <>
                  { book.results &&
                    <BookContainer navigate={navigate} title={book.results[0].title.raw} authors={book.results[0].authors.raw} book_id={book.results[0].book_id.raw} image_url={book.results[0].image_url.raw} key={idx}/>
                  }
                </>
                )}
            </div>
          </div>
        }

        { props.isLoggedIn &&
        ((userBasedBooks &&
        userBasedBooks.length === 0) || isLoadingUserBased === true) && 
          <div style={{marginTop: '20px'}}>
            <Typography variant="h6">Rate more books to receive more recommendation!</Typography>
          </div>
        }
        
        
    </Grid>
  );
}

export default DashBoardRecommendation;
