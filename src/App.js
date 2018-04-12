import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends Component {

    constructor()
    {
        super();
        this.code = "";
        try {
            this.code = this.getParameterURL('code');
        } catch (e) {
        console.log(this.code);
    }

    getParameterURL(a) {
        let c = [];
        let b = window.location.search.substring(1).split('&');
        b.forEach(w => c.push({ "key": w.split('=')[0], "value": w.split('=')[1] }));
        try {
            return c.find(w => w.key === a).value;
        }catch (e) {
            return "";
        }
    }

    handleLoginSocial(e)
    {
        console.log(e.target.id);
        $.ajax({
            url: `http://localhost:9000/account/v1/sns/start/via/${e.target.id}`,
            method: 'GET',
            success: function (rs) {
                console.log(rs.data);
                window.location.href = rs.data;
            },
            error: function (rs) {
                console.log(rs);
            }
        })
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button type="button" id="facebook" ref="facebook" onClick={this.handleLoginSocial.bind(this)} >Connect with Facebook</button>
        <button type="button" id="twitter" ref="twitter" onClick={this.handleLoginSocial.bind(this)}>Connect with Twitter</button>
      </div>
    );
  }
}

export default App;
