import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { render } from "react-dom";
import MainMap from './Map/MainMap';
import SignIn from './LoginPage';
import Register from './RegisterPage';
import Nav from './Nav';
import {BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory} from "react-router-dom";
import SideBar from './SideBar/SideBar';
import StartProjectPage from './StartupPage/StartProjectPage'
import InsertVehiclePage from './InsertVehiclePage/InsertVehicles'
import { browserHistory } from 'react-router'
import { Box, Container } from "@material-ui/core";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      email:''
    };
  }

  

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8000/api/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          // console.log('wrap1')
          // console.log(json)
          // console.log('wrap2')
          // json[Object.keys(json)] )
          if ( Object.keys(json).length > 1 ){
            this.setState({ username: json.username, logged_in: true});
          } else {
            this.setState({ username: null, logged_in: false});
          }
          console.log('Logged in as: '+ this.state.username)
          console.log('Logged in?: '+ this.state.logged_in)
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username
        });
        console.log('logged in as user: ' + this.state.username) 
      })
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    return fetch('http://localhost:8000/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        console.log(res.status)
        let json = res.json()//.then(json => console.log(Object.keys(json)))
        
        if (res.status == 201){
          console.log('success')
          
          localStorage.setItem('token', json.token);
          this.setState({
            logged_in: true,
            username: json.username,
            email:json.email
          });
          return true
        } 
        else {
          json.then(json => alert(Object.keys(json)[0] + ": " + json[Object.keys(json)[0]]))
          console.log('fail')
          return false;
        }
      })

      
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  render() {
    return (

          <Container  component="div" style={{width:'100%', maxWidth:'100%', margin:'0', padding:'0'}}>
            
            <Router>
              <Box component="span" overflow="hidden">
                <SideBar handle_logout={this.handle_logout} logged_in={this.state.logged_in} />
              </Box>
              
              <Box component="span"> 
                <Switch>
                    <Route exact path='/'><StartProjectPage userState={this.state}/></Route>
                    <Route exact path='/vehicles'><InsertVehiclePage userState={this.state}/></Route>
                    <Route exact path='/main'><StartProjectPage userState={this.state}/></Route>
                    <Route exact path='/login'><SignIn handle_login={this.handle_login} logged_in={this.state.logged_in}/></Route>
                    <Route exact path='/register'><Register handle_signup={this.handle_signup} logged_in={this.state.logged_in}/></Route>
                    <Route exact path='/map'><MainMap user_data={this.state} /></Route>
                </Switch>
              </Box>
              
                
         
              
            </Router>

          </Container>
          
          

    );
  }
}

export default withRouter(App);

const appDiv = document.getElementById("app");
render(<App />, appDiv);
 



