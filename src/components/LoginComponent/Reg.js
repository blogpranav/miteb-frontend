import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import './LoginComponent.css'
import LoginComponent from './LoginComponent'
import {hashHistory} from 'react-router'
import { connect } from 'react-redux'

import { userActions } from './../../actions/userActions'
import {firebaseAuth} from '../../firebaseConfig' 


const paperStyle = {
  padding: 30,
  textAlign: 'center',
  display: 'inline-block',
  minHeight: 470,
  maxWidth: 320,
  borderBottom: '6px solid #00bcd4',
};

class Reg extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      loading: false,
      signup: false,
    }
  }

  componentWillMount() {
    if(this.props.user) {
      console.log('user prop exists')
      hashHistory.push('/dashboard')
    }
    else {
      console.log('user prop DNE')
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user) {
      console.log('user prop exists')
      hashHistory.push('/dashboard')
    }
    else {
      console.log('user prop DNE')
    }
  }

  render () {
    return (
      <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 30}}>
      <div hidden={this.props.isMobile} style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1>MIT Event Booking Portal</h1>
        <div style={{width: '70%'}}>
        <p>Your One-stop destination to book rooms, lodge complaints, request publicity permissions and what not xD</p>
        </div>
      </div>

      <div className="authPage">
        <Paper zDepth={5} style={paperStyle}>
            <div>
              {this.props.children}   
            </div>
          </Paper>
      </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {loggedIn, user}  = state.authentication
  const {isMobile} = state.toggler
  return {
    loggedIn,
    user,
    isMobile
  }
}

export default connect(mapStateToProps)(Reg)