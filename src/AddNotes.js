import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export class AddNotes extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            homework:" ",
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            redirect:false,
            myFile:null,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
    }
    handleSubmit(event){
        console.log(this.state.myFile);
        var subjectName = this.state.subject + " " + "by" + " " + this.state.user;
       for(let x=0; x<this.state.myFile.length;x++)
       {
           var data = new FormData();
           data.append('file',this.state.myFile[x],this.state.myFile[x].name)
           data.append('subjectName',subjectName)
           data.append('filename',this.state.homework)
           axios.post('http://localhost:4495/hwUpload',
               data
            ).then((f) => {
           })
       }
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
    handleChange2(event)
    {
        this.setState({
            [event.target.name] : event.target.files
        })
        
    }

    render(){
        return(
             this.state.redirect ? <Redirect to ="/target" /> :
            <div> 
                Welcome to {this.props.match.params.sub} 
                <br/>
                <form enctype="multipart/form-data" onSubmit={this.handleSubmit}>
                <label>Add Notes for the students</label>
                <br/>
                <textarea name="homework" value={this.state.homework} onChange={this.handleChange}/>
                <br/>
                <label>Select appropriate file</label>
                <input type="file" multiple 
                name="myFile"  className="multiple-upload" 
                onChange={this.handleChange2} />
                <input type="submit" value="Post"/>
                </form>
            </div>
        )
    }

}