import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { blueGrey } from '@mui/material/colors'

const fontcolor = blueGrey[600]

const defaultImg = "https://edit.org/images/cat/book-covers-big-2019101610.jpg"

function MainCollectionCard() {
  let navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          width: 1,
          height: 250,
        },
        paddingBottom: 2
      }}
    >
      <Paper elevation={4}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Grid item>
            <Typography
              variant="h6"
              style={{
                "margin-left": "10px",
                color: fontcolor,
              }}
            >
              Main Collection
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={() => navigate(`/collection`)}
            >
              View
            </Button>
          </Grid>
        </Grid>
        <img width="110em"
          src={defaultImg}
          alt="Book cover"
          style={{
            cursor: "pointer",
            margin: "15px"
          }}
          onClick={() => navigate(`/book/69`)}
        />
        <img width="110em"
          src={defaultImg}
          alt="Book cover"
          style={{
            cursor: "pointer",
            margin: "15px"
          }}
          onClick={() => navigate(`/book/69`)}
        />
        <img width="110em"
          src={defaultImg}
          alt="Book cover"
          style={{
            cursor: "pointer",
            margin: "15px"
          }}
          onClick={() => navigate(`/book/69`)}
        />
        <img width="110em"
          src={defaultImg}
          alt="Book cover"
          style={{
            cursor: "pointer",
            margin: "15px"
          }}
          onClick={() => navigate(`/book/69`)}
        />
      </Paper>
    </Box>
  );
}

export default MainCollectionCard