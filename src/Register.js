import React from "react";
import axios from 'axios';
import Select from 'react-select';
import { Redirect } from 'react-router-dom';
export class Register extends React.Component{
    constructor(props)
    {
        super(props);
        console.log("===");
        this.state={
            user:'',
            pass:'',
            subject_professor:[],
            selectedOption:null,
            redirect:false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount()
    {
        let subject_prof=[];
        axios.get('http://localhost:4495/allProf').then(s => {
            if(s)
            {
                for(let x in s.data)
                {
                    let q = s.data[x];
                    let temp={
                        value:q,
                        label:q
                    };
                    subject_prof.push(temp);
                }
                this.setState({
                    subject_professor:subject_prof
                });
            }
        });
    }

           
    handleSubmit(event){
        console.log(this.state.selectedOption);
        let x=[];
        for(let y in this.state.selectedOption)
        {
            x.push(this.state.selectedOption[y].value);
        }
        axios.post('http://localhost:4495/send',{
            username:this.state.user,
            password:this.state.pass,
            designation:"student",
            subject:x
        }).then(function (f){
            if(f)
            {
                console.log(f);
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
    subjectChanged = (newsubject) => {
        this.setState({
          subject: newsubject
        });
      }
      handleChange2 = (selectedOption) => {
        this.setState({ selectedOption });
      }
    render()
    {
        const { selectedOption } = this.state;
        return (
            this.state.redirect ? <Redirect to ="/" /> :
            <div>
                <p> Student Registration </p>
                <form onSubmit={this.handleSubmit}>
                <label>Enter Your Name</label><br/>
                <input type="text" name="user" value={this.state.value1} onChange={this.handleChange}/>
                <br/>
                Subjects:
                <br/>
                <Select
                isMulti
                name="subjects"
                value={selectedOption}
                onChange={this.handleChange2}
                options={this.state.subject_professor}
                />
                <label>Enter Your Password</label>
                <br/>
                <input type="password" name="pass" value={this.state.value2} onChange={this.handleChange}/>
                <input type="submit" value="Login"/>
                </form>
            </div> 
            
        );
    }   
}


