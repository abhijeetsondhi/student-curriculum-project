import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom'
export class Login extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            user:'',
            pass:'',
            redirect:false,
            login:false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event){
        axios.post('http://localhost:4495/login',{
            username:this.state.user,
            password:this.state.pass
        }).then((f) => {
            if(f.data.length >= 1)
            {
                console.log(f.data[0]);
                localStorage.setItem("user",f.data[0].firstName);
                localStorage.setItem("designation",f.data[0].designation);
                localStorage.setItem("subjects",JSON.stringify(f.data[0].subject));
                this.setState({
                    redirect:true,
                    login:true
                });
                console.log(localStorage);
            }
            else
            {
                console.log(f.data);
                this.setState({
                    redirect:false,
                    login:true
                })
            }
        });
        event.preventDefault();
    }
    handleChange(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render()
    {
        return (
        this.state.redirect ? (<Redirect to="/target" />) : 
        (this.state.login ? ( <div>
            <p> <b>Enter valid credentials</b> </p>
            <form onSubmit={this.handleSubmit}>
            <label>Enter Your Name</label><br/>
            <input type="text" name="user" value={this.state.value1} onChange={this.handleChange}/>
            <br/>
            <label>Enter Your Password</label>
            <br/>
            <input type="password" name="pass" value={this.state.value2} onChange={this.handleChange}/>
            <br/>
            <input type="submit" className="btn btn-primary" value="Login"/>
            </form>
            </div> )  : (<div> <form onSubmit={this.handleSubmit}>
            <label>Enter Your Name</label><br/>
            <input type="text" name="user" value={this.state.value1} onChange={this.handleChange}/>
            <br/>
            <label>Enter Your Password</label>
            <br/>
            <input type="password" name="pass" value={this.state.value2} onChange={this.handleChange}/>
            <br/>
            <input type="submit" className="btn btn-primary" value="Login"/>
            </form></div>) ) 
        );
    }   
}


