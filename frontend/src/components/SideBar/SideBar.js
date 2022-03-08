import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MailIcon from '@material-ui/icons/Mail';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { Link } from 'react-router-dom';


import { Redirect, useHistory } from "react-router-dom";
import { FaMapMarkedAlt, FaMapMarkerAlt, FaTruck, FaCogs } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { Grid } from '@material-ui/core';



const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        width:'100%',
      },
      appBar: {
        backgroundColor: 'green',
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      logo: {
        //display:'flex',
        flexGrow: 1,
        fontSize: 22,
        justifySelf: 'left',
        alignItems:'left',
        
      },
      userAvatar: {
        //display:'flex',
        justifySelf: 'right',
        alignItems:'center',
        
      },
      hide: {
        display: 'none',
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 1,
      },
      drawerPaper: {
        width: drawerWidth,
      },
      subOption:{
        paddingLeft: 18,
      },
      
      drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
      },

      content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
      },
      contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
}));




export default function SideBar(props) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const [cadastrarOpen, setCadastrarOpen] = React.useState(false);

    const openUserMenu = Boolean(anchorEl);
        


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
      handleClose();
      props.handle_logout();
    }

    const routeChange = (route) =>{ 
      //let path = `login`; 
      history.push(route);
    }

    const userAvatar = (
      <div>
        <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
        >
            <AccountCircle className={classes.userAvatar}/>
        </IconButton>
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openUserMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
      </div>
    );


    function UserLogged() {
      if (props.logged_in){
        return (userAvatar);
      }
      else {
        return(<div>
          <Button color="inherit" className={classes.userAvatar} onClick={() => routeChange(`login`)}>Login</Button>
        </div>);
      }
    };


    const handleClickOpenMenu = (element, setElement) => {
      setElement(!element);
    };



    return (
        <div className={classes.root}>
          <CssBaseline />
            <AppBar
                position="sticky"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
            >
              <Toolbar>
                  <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      className={clsx(classes.menuButton, open && classes.hide)}
                  >
                      <MenuIcon />
                  </IconButton>    

                  <Button color="inherit" className={classes.logo} onClick={() => routeChange(``)}>Brown Solutions</Button>

                  {UserLogged()}
              </Toolbar>

            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                </div>
                <Divider />
                <List>
                
                  <ListItem button  onClick={() => handleClickOpenMenu(cadastrarOpen, setCadastrarOpen) }>
                    <ListItemIcon><FaCogs size={25}/></ListItemIcon>
                    <ListItemText primary={'Cadastrar'} />
                    {cadastrarOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={cadastrarOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding className={classes.subOption}>
                      <ListItem button component={Link} to='/'>
                        <ListItemIcon><FaMapMarkerAlt size={25}/></ListItemIcon>
                        <ListItemText primary="Serviços" />
                      </ListItem>
                      <ListItem button component={Link} to='/vehicles'>
                        <ListItemIcon><FaTruck size={25}/></ListItemIcon>
                        <ListItemText primary="Veículos" />
                      </ListItem>
                    </List>
                  </Collapse>
                  
                </List>
                <Divider />
                <List>

                  <ListItem button key={'Map'} component={Link} to='/map'>
                    <ListItemIcon><FaMapMarkedAlt size={28}/></ListItemIcon>
                    <ListItemText primary={'Mapa'} />
                  </ListItem>

                </List>
            </Drawer>
        </div>
    );
}





