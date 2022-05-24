import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import { useStyles } from "../pages/LeaderBoard/LeaderBoard.css"
import { makeStyles } from '@material-ui/styles'


const ReadingTable = () => {
  const navigate = useNavigate();
  const classes = useStyles("");
  const [data, setData] = React.useState([]);

  useEffect(() => {
    // user data
    axios.get(`http://127.0.0.1:5000/getleaderboard`)
    .then((response)=> {
      setData(response.data);
    })
    return ()=>{}
  }, [])


  return (
    <div>
        <table>
            <thead>
                <tr>
                    <th className={classes.th}>ranking </th>
                    <th className={classes.th}>username</th>
                    <th className={classes.th}>score</th>
                </tr>
            </thead>
            <tbody >
            {
            data?.map((d,i)=>
              <>
                {d.username!==undefined && d.username.raw!=="" &&
                  <tr key={i} >
                      <td className={classes.td}>
                        {i+1}
                      </td >
                      <td className={classes.td}>
                        {d.username?.raw}
                      </td>
                      <td className={classes.td}>
                      {d.score?.raw}
                      </td>
                  </tr>
                }
              </>
            )
            }
            </tbody>
        </table>
    </div>
  );
}

export default ReadingTable;