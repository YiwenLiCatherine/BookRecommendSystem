import React from 'react'
import { Card, CardMedia, CardContent, CardActions, Button, Typography } from '@mui/material';
import BookContainer from './BookContainer';

function DashBoardMainCollection(props) {
    return (
      <div>
        Main Collection
        <BookContainer navigate={props.navigate} title={"Title"} authors={"Authors"} book_id={69} image_url={"https://picsum.photos/200/300"} key={1}/>
      </div>
    )
}

export default DashBoardMainCollection;
