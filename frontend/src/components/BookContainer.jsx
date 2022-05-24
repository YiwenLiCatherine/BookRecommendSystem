import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardHeader, CardContent, CardActions, CardMedia, Button, Paper, Typography } from "@mui/material"


const BookContainer = (props) => {
  return (
    <div style={{ height: "55vh", width: "18vw", margin: "16px"}}>
      <Paper style={{ height: "100%", width: "18vw", minWidth: "100px" }}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardHeader
            title={
              <Typography gutterBottom variant="h6" component="h4" style={{fontSize: '12pt', fontWeight: 'bold'}}>
                {props.title}
              </Typography>
            }
            subheader={
              <Typography gutterBottom variant="h6" component="h6" style={{fontSize: '9pt'}}>
                {props.authors}
              </Typography>
            }
            onClick={() => props.navigate(`/book/${props.book_id}`)}
            style={{ cursor: "pointer", height: "12vh", marginTop: "10px"}}
          />
          <div
            style={{
              display: "flex",
              alignItem: "center",
              justifyContent: "center",
              marginTop: "10px"
            }}
          >
            <CardMedia
              onClick={() => props.navigate(`/book/${props.book_id}`)}
              style={{
                width: "auto",
                height: "35vh",
                cursor: "pointer"
              }}
              component="img"
              image={props.image_url}
              title={props.title}
            />
          </div>
        </Card>

      </Paper>
    </div>
  );
}

export default BookContainer;