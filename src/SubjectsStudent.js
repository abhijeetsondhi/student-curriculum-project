import React from "react";
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
export class SubjectsStudent extends React.Component{
    
    constructor(props)
    {
        let styles = {
            width: '18rem',
          };
        super(props);
        this.state={
            subjects:JSON.parse(localStorage.getItem("subjects")),
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            redirect:false
        }
    }

    

    componentWillMount()
    {
        if(this.state.subjects === null)
        {
            this.setState({
                redirect:true
            })
        }
    }
    returnValues()
    {
        let result = [];
        if(this.state.designation === "prof")
        {
            for(let i=0;i<this.state.subjects.length;i++)
            {
                let x = this.state.subjects[i];
                result.push(<p><div className="card"><div className="card-body"><h5 className="card-title">{this.state.subjects[i]}</h5><a href={'/post/'+x} className="card-link">Announcement</a> <a href={'/scores/'+x} className="card-link">Add Scores</a><a href={'/notes/'+x} className="card-link">Add Notes</a><a href={'/homework/'+x} className="card-link">Add Homework</a><a href={'/viewWork/'+x} className="card-link">View Submission</a><a href={'/updateScore/'+x} className="card-link">Update Scores</a></div></div></p>);
            }
        }
        else
        {
            for(let i=0;i<this.state.subjects.length;i++)
            {
                let x = this.state.subjects[i];
                result.push(<p><div className="card"><div className="card-body"><h5 className="card-title">{this.state.subjects[i]}</h5><a href={'/announcement/'+x} className="card-link">Announcement</a> <a href={'/viewScore/'+x} className="card-link">View Scores</a><a href={'/viewNotes/'+x} className="card-link">View Notes</a><a href={'/viewHomework/'+x} className="card-link">View Homework</a></div></div></p>);
            }
        }
        return result
    }
    render(){
        return(
            this.state.redirect ? <Redirect to="/" /> :
            <div>
                <p>This is {this.state.user} </p>
                <p> My Subjects are </p>
                {this.returnValues()}
                </div>
        );
    }
}

