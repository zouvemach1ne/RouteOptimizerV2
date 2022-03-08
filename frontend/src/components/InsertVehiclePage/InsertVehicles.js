import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';
import React, {useState, Fragment, useCallback, useEffect } from 'react';
import {BrowserRouter as Router, Redirect, useHistory} from "react-router-dom";

import { Box, Grid, Paper, Typography } from '@material-ui/core';
import HorizontalStepper from './Stepper/Stepper';
import UploadFile from '../utils/FileParser'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(10),
    padding: 10,
  },
  content: {
    alignItems:"center",
    justifyContent:"center",
  },
  paper:{
    width:'90%',
    margin: "10px",
    padding: "10px"
  },
}));


const initData = [{
  "username": null,
  'values'   : null,
  'columns': null,
  "filename": null
}]

export default function StartProjectPage(props) {
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    if (props.userState.logged_in == false){
      history.push(`/login`);
    }
  }, [props.userState.logged_in]);
  
  const [data1, setData1] = React.useState(initData);
  function useCallback (childData) {
    const finalJson = []
    for (let index = 0; index < childData.values.length; index++) {
      finalJson.push({
        "username": props.userState.username,
        "columns" : JSON.stringify(childData.columns),
        "values"  : JSON.stringify(childData.values[index] ),
        "filename": "teste.txt"
      })
    };
    setData1(finalJson)
  }

  return(
      <div className={classes.root}>
        
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant="h6">
              Welcome {props.userState.username}!
            </Typography>
          </Box>
          <Box display='flex' className={classes.content}>
            <Paper elevation={5} className={classes.paper}>
              <Typography variant="h6" style={{'display':'flex', 'fontSize': '14px', 'justifyContent':'center', 'alignSelf':'center'}}>
                Insira os dados necessários para o planejamento.
              </Typography>
              <div style={{'display':'flex', 'fontSize': '14px', 'justifyContent':'center', 'alignSelf':'center'}}>
                <UploadFile callback={useCallback} />
              </div>
              <HorizontalStepper logged_in={props.userState.logged_in} username={props.userState.username} fileData={data1}/>
            </Paper>
            
          </Box>

      </div>
  )

}




