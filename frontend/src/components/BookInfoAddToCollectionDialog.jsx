import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom'
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

function ConfirmationDialogRaw(props) {
  const { currUsername, open, onClose, value, setValue } = props;
  const radioGroupRef = useRef(null);
  const [options, setOptions] = useState([])

  const loadCollections = async () => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(`http://127.0.0.1:5000/getcollections`, {
      method: 'POST',
      headers: {
        // Authorization: authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: currUsername,
      })
    })
    const responseData = await response.json()
    if (response.status === 200) {
      return responseData;
    } else {
      alert("Collection post failed")
    }
  }

  useEffect(() => {
    loadCollections().then((resData) => {
      const collections = resData
      const collections_list = []
      for (var name in collections) {
        if (name === "Main Collection") {
          collections_list.unshift(name)
        } else {
          collections_list.push(name)
        }
      }
      setOptions(collections_list)
    })
  }, [open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
    >
      <DialogTitle>Choose the collection you want to add to</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function BookInfoAddToCollectionDialog(props) {
  const { bookName, currUsername, open, setOpen, setSnackBar, setSnackBarContent } = props
  const [value, setValue] = useState('')
  const params = useParams()
  const bookId = params.bookId

  const putBookToCollection = async (newValue) => {
    // const authToken = `Bearer ${localStorage.getItem('token')}`
    const response = await fetch(`http://127.0.0.1:5000/addcollections`, {
      method: 'POST',
      headers: {
        // Authorization: authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book_id: parseInt(bookId),
        username: currUsername,
        collectionname: value
      })
    })
    const responseData = await response.json()
    if (responseData.STATUS === 'ADDED') {
      setSnackBar(true)
      setSnackBarContent(`${bookName} has been added to ${newValue}`)
    } else {
      alert(`${bookName} is already in ${newValue}`)
    }
  }
  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue)
      putBookToCollection(newValue)
    }
    setValue('')
  };

  return (
    <ConfirmationDialogRaw
      keepMounted
      currUsername={currUsername}
      open={open}
      onClose={handleClose}
      value={value}
      setValue={setValue}
    />
  );
}
