import React from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';

export class UploadHomework extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            hwName:this.props.match.params.name,
            subject:this.props.match.params.sub,
            redirect:false,
            submitted:false,
            error:false,
            myFile:null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
    }
    componentWillMount()
    {
        var x = false;
        axios.get('http://localhost:4495/checkHwk/'+this.state.subject+'/'+this.state.hwName + '/'+this.state.user).then((f) => {
            if(f)
            {
                x = f;
            }
            if(x)
            {
                this.setState({
                    submitted:true
                })
            }
        })
    }
    handleSubmit(event){
        this.setState({
            redirect:false,
            error:false,
        })
        for(let x=0; x<this.state.myFile.length;x++)
        {
            
            var data = new FormData();
            data.append('file',this.state.myFile[x],this.state.myFile[x].name)
            data.append('subjectName',this.state.subject)
            data.append('usr',this.state.user);
            data.append("homeworkName",this.state.hwName)
            data.append('date',new Date())
           axios.post('http://localhost:4495/uploadHwk/'+this.state.subject+'/'+this.state.hwName,data
            ).then((f) => {
                console.log(f.data);
                if(!f.data)
                {
                    alert("Deadline already passed.Your homework was not submitted");
                }
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
    handleChange3(event)
    {
        this.setState({
            [event.target.name] : event.target.files
        }) 
    }

    render(){
        return(
        this.state.redirect ? (<Redirect to ="/target" />) :
            (this.state.submitted ? (<div>You have already submitted the homework</div>) : (
            <div> 
                Welcome to {this.props.match.params.sub} 
                <br/>
                <form enctype="multipart/form-data" onSubmit={this.handleSubmit}>
                <label>{this.state.hwName}</label>
                <br/>
                <label>Select appropriate file</label>
                <input type="file" multiple 
                name="myFile"  className="multiple-upload" 
                onChange={this.handleChange3} />
                <br/>
                <input type="submit" value="Post"/>
                </form>
            </div> ))
        )
    }

}