import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { blueGrey } from '@mui/material/colors'

const linecolor = blueGrey[200]

const defaultImg = "https://edit.org/images/cat/book-covers-big-2019101610.jpg"

function BookDemo() {
  let navigate = useNavigate();

  return (
    <>
      <Grid container sx={{ marginTop: 3 }}>
        <Grid item xs>
          <img width="110em"
            src={defaultImg}
            alt="Book cover"
            sx={{
              marginLeft: 2
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
            <Grid item>
              Author(s): {"authorName"}
            </Grid>
            <Grid item>
              ISBN: {"ISBN"}
            </Grid>
            <Grid item>
              Public year: {"publicDate"}
            </Grid>
            <Grid item>
              <Rating value={4} precision={0.1} readOnly />
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
              <Button
                variant="outlined"
                size="small"
              >
                View
              </Button>
            </Grid>
            <Grid item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <hr style={{
        color: linecolor
      }} />
    </>
  );
}

export default BookDemo