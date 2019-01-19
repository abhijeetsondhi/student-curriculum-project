import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export class Post extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            posts:" ",
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            redirect:false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(event){
        axios.post('http://localhost:4495/post',{
            post:this.state.posts,
            subjectName:this.state.subject + " " + "by" + " " + this.state.user
        }).then((f) => {
            if(f)
            {
                console.log(f.data);
            }
        });
        event.preventDefault();
        this.setState({
            redirect:true
        })
    }
    handleChange(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render(){
        return(
             this.state.redirect ? <Redirect to ="/target" /> :
            <div> Welcome to {this.props.match.params.sub} 
            <br/>
            <form onSubmit={this.handleSubmit}>
                <label>Enter the Announcement</label><br/>
                <textarea name="posts" value={this.state.posts} onChange={this.handleChange}/>
                <br/>
                <input type="submit" value="Post"/>
                </form>
            </div>
        );
    }

}