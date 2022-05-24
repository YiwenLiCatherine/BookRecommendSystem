import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import SearchIcon from "@mui/icons-material/Search"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { useNavigate } from "react-router-dom"
import el from "date-fns/esm/locale/el/index.js"
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    btn:{
      background:'linear-gradient(20deg , #d5edea 30%, #9f9dcc 90%)',
      fontSize:'10px'
    }
  })

export default function SearchBar(props) {

    const [option, setOption] = React.useState('');
    const [searchKeyword, setsearchKeyword] = React.useState('');
    const [searchTitle, setSearchTitle] = React.useState('');
    const classes = useStyles("");

    const navigate = useNavigate();

    const SearchsearchKeyword = () => {
        if (searchKeyword === '') {
            alert('please input the search content');
        } else {
            if (option === '') {
                alert("select search type");
            } else if (option === 'Book'){
                navigate('/searchbook/' + searchKeyword);
            } else if (option === 'Author') {
                navigate('/searchauthor/' + searchKeyword);
            } else if (option === 'User') {
                navigate('/searchuser/' + searchKeyword);
            }
        }
    }

    return (
        <Box>
            <Paper
            component="form"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "60%",
                height: "60px",
                marginTop: "100px",
            }}
            >
            <SearchIcon />
            {option === 'User' &&
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="search user by username"
                    inputProps={{ "aria-label": "search users" }}
                    onChange={(e)=>setsearchKeyword(e.target.value)}
                />
            }
            {option === 'Book' &&
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="search book by title"
                    inputProps={{ "aria-label": "search books" }}
                    onChange={(e)=>setsearchKeyword(e.target.value)}
                />
            }
            {option === 'Author' &&
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="search book by author"
                    inputProps={{ "aria-label": "search books" }}
                    onChange={(e)=>setsearchKeyword(e.target.value)}
                />
            }
            {!(option === 'User' || option === 'Book' || option === 'Author') &&
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="select search type below"
                    inputProps={{ "aria-label": "search books" }}
                    onChange={(e)=>setsearchKeyword(e.target.value)}
                />
            }
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Button variant="contained" onClick={SearchsearchKeyword}> Search </Button>
            </Paper>

            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="Book" control={<Radio />} label="Book"  onClick={() => {
                        setOption('Book');
                    }}/>
                    <FormControlLabel value="Author" control={<Radio />} label="Author" onClick={() => {
                        setOption('Author');
                    }}/>
                    {props.isLoggedIn === true &&
                        <FormControlLabel value="User" control={<Radio />} label="User" onClick={() => {
                            setOption('User');
                        }}/>
                    }
                </RadioGroup>
            </FormControl>
        </Box>
    )
}
