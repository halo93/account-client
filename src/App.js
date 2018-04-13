import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends Component {

    constructor() {
        super();
        this.code = "";
        this.appId = "";
        this.appSecret = "";
        this.oauth_token = "";
        this.oauth_verifier = "";
        try {
            if(localStorage.getItem("provider")) {
                if(localStorage.getItem("provider") === "facebook"){
                    this.appId = "1805391003067479";
                    this.appSecret = "ff63e5ef593b9f2a3c762e40adfad55a";
                    this.code = this.getParameterURL('code');
                    if(this.code) {
                        $.ajax({
                            url: `https://graph.facebook.com/v2.12/oauth/access_token?client_id=${this.appId}
                        &redirect_uri=https%3A%2F%2F9f5c42d7.ngrok.io/&client_secret=${this.appSecret}&code=${this.code}`,
                            method: 'GET',
                            success: function (rs) {
                                // console.log(rs.data);
                                $.ajax({
                                    url: `http://localhost:9000/account/v1/${localStorage.getItem("provider")}/get-user-profile?access-token=${rs.access_token}`,
                                    method: 'GET',
                                    success: function (data) {
                                        $("#user-profile").append(`
                                            <p>${data.data.email}</p>
                                            <p>${data.data.firstName}</p>
                                            <p>${data.data.lastName}</p>
                                            <p><img src=${data.data.image} /></p>
                                        `);
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                })
                            },
                            error: function (rs) {
                                console.log(rs);
                            }
                        })
                    }
                } else if (localStorage.getItem("provider") === "twitter") {
                    this.appId = "3BBuR3EiOzwjjh4wDMOVr7E9N";
                    this.appSecret = "wTZDICHAgNmKWQ7BtdSefRePZOAL88nfJkp4hIb0gARLlFugAA";
                    this.oauth_token = this.getParameterURL('oauth_token');
                    this.oauth_verifier = this.getParameterURL('oauth_verifier');
                    if(this.oauth_token && this.oauth_verifier){
                        $.ajax({
                            url: `http://localhost:9000/account/v1/${localStorage.getItem("provider")}?oauth_token=${this.oauth_token}&oauth_verifier=${this.oauth_verifier}`,
                            method: 'GET',
                            success: function (rs) {
                                let token = rs.data.split(" | ");
                                let url = `http://localhost:9000/account/v1/${localStorage.getItem("provider")}/get-user-profile?access-token=${token[0]}&access-token-secret=${token[1]}`;
                                console.log(url);
                                $.ajax({
                                    url: url,
                                    method: 'GET',
                                    success: function (data) {
                                        $("#user-profile").text("").append(`
                                        <p>${data.data.email}</p>
                                        <p>${data.data.firstName}</p>
                                        <p>${data.data.lastName}</p>
                                        <p><img src=${data.data.image} /></p>
                                    `);
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                })
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        })
                    }
                }
            }
        } catch (e) {
            console.log(this.code);
        }
    }
    getParameterURL(a)
    {
        let c = [];
        let b = window.location.search.substring(1).split('&');
        b.forEach(w => c.push({"key": w.split('=')[0], "value": w.split('=')[1]}));
        try {
            return c.find(w => w.key === a).value;
        } catch (e) {
            return "";
        }
    }

    handleLoginSocial(e)
    {
        console.log(e.target.id);
        localStorage.setItem("provider", e.target.id);
        $.ajax({
            url: `http://localhost:9000/account/v1/sns/start/via/${localStorage.getItem("provider")}`,
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

    render()
    {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <button type="button" id="facebook" ref="facebook"
                        onClick={this.handleLoginSocial.bind(this)}>Connect with Facebook
                </button>
                <button type="button" id="twitter" ref="twitter" onClick={this.handleLoginSocial.bind(this)}>Connect
                    with Twitter
                </button>
                <div id="user-profile">

                </div>
            </div>
        );
    }
}
export default App;
