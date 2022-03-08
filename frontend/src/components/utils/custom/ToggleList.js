import React, {useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { CssBaseline } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { Chip } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    root: {
      margin: 'auto',
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: 250,
      height: 230,
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
    itemLat: {
      backgroundColor: theme.palette.secondary.main + ' !important',
      color: 'white',
      
    },
    itemLng: {
      backgroundColor: theme.palette.primary.main + ' !important',
      color: 'white',
    },
    itemKey: {
      backgroundColor: theme.palette.success.main + ' !important',
      color: 'white',
    },
    item: {
      
    },
    chip_lat:{
      backgroundColor: theme.palette.secondary.light,
      color: 'white'//theme.palette.secondary.dark,
    },
    chip_lng:{
      backgroundColor: theme.palette.primary.light,
      color: 'white'//theme.palette.primary.dark,
    },
    chip_key:{
      backgroundColor: theme.palette.success.light,
      color: 'white'//theme.palette.primary.dark,
    },

  }));

  


export default function ToggleList(props) {
  const classes = useStyles();
  const [list, setList] = React.useState(props.list)


  const handleToggle = (value) => {
    if (value == props.lat){
      props.setLat(null)
    }
    else if(value == props.lng) {
      props.setLng(null)
    }
    else if(value == props.keys) {
      props.setKey(null)
    }
    else if(props.lat == null){
      props.setLat(value)
    } 
    else if(props.lng == null) {
      props.setLng(value)
    }
    else if(props.keys == null) {
      props.setKey(value)
    }
  }


  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      <CssBaseline />
      <List  className={classes.list}>
        {list.map((value) => {
          return(
            <ListItem 
              button
              selected
              key={value} 
              onClick={() => handleToggle(value)} 
              className={clsx(
                {[classes.item]: value!=props.lng && value!=props.lat && value!=props.keys}, 
                {[classes.itemLng]: value==props.lng},
                {[classes.itemLat]: value==props.lat},
                {[classes.itemKey]: value==props.keys},
                
              )}
            >
              <ListItemText id={value} primary={value} />
              {value===props.lat ?  (
                  <Chip
                    label="LAT"
                    className={classes.chip_lat}
                  />
                ) : value===props.lng ? (
                  <Chip
                    label="LNG"
                    className={classes.chip_lng}
                  />
                ) : value===props.keys ? (
                  <Chip
                    label="ID"
                    className={classes.chip_key}
                  />
                ) : <></>
              }
            </ListItem>
          );
        })}
        
      </List>
    </Grid>
  )

}





