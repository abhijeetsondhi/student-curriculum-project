import React from "react";
import axios from 'axios';
import Input from './Input';
import Input2 from './Input2';
import { Link,Redirect } from 'react-router-dom';
export class Scores extends React.Component{
    inputValues = new Map();
   
    constructor(props)
    {
        
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            students:[],
            subject:this.props.match.params.sub,
            score:0,
            outOf:100,
            exams:"",
            inputs:[],
            redirect:false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount()
    {
        var subjectName = this.state.subject + " " + "by" + " " + this.state.user;
        axios.get('http://localhost:4495/scores/'+ subjectName).then((f) =>
        {
            console.log(f.data);
            var temp = [];
            for(var x in f.data)
            {
                temp.push(f.data[x]);
            }
            this.setState({
                students:temp
            });

        });
    }

    handleSubmit(event){
    var subjectName = this.state.subject + " " + "by" + " " + this.state.user;
    axios.post('http://localhost:4495/addScore',{
        scores:this.state.inputs,
        subjectname:subjectName,
        testName:this.state.exams
    }).then((f) =>
    {
        console.log(f.data);
    });
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

    handleAdd(name,score)
    {
        var flag = false;
        var temp = this.state.inputs.slice();
        var x = {
            student:name,
            score:score,
            outOf:100
        }
        for(var t in temp)
        {
            if(temp[t].student === name)
            {
                temp[t].score = score
                flag = true;
                break;
            }
        }
        if(!flag)
        {
            temp.push(x);
        }
        this.setState({
            inputs:temp
        });
        console.log(temp);
        
    }

    handleAdd2(name,outOf)
    {
        var flag = false;
        var temp = this.state.inputs.slice();
        var x = {
            student:name,
            score:0,
            outOf:outOf
        }
        for(var t in temp)
        {
            if(temp[t].student === name)
            {
                temp[t].outOf = outOf
                flag = true;
                break;
            }
        }
        if(!flag)
        {
            temp.push(x);
        }
        this.setState({
            inputs:temp
        });
        console.log(temp);
        
    }


    render(){
        return(
            this.state.redirect ? <Redirect to="/target" /> :
            <div>
                <p>Add Scores </p>
                <br/>
                <label>Test name:</label><br/>
                <form onSubmit={this.handleSubmit}>
                <input type="text" name="exams" value={this.state.exams} onChange={this.handleChange}/>
                <br/>
                Student Scores
                <br/>
                <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Score</th>
      <th scope="col">Out Of</th>
    </tr>
  </thead>
  <tbody>
                {
                this.state.students.map((value,index) => {
                    return(
                        <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{value}</td>
                        <td><Input initialValue={this.state.score} name={value} addValue={this.handleAdd.bind(this)}/></td>
                        <td><Input2 initialValue={this.state.outOf} name={value} addValue={this.handleAdd2.bind(this)}/></td>
                        </tr>
                    )
                })
                }
                </tbody>
                </table>
                <input type="submit" value="Add scores"/>
                </form>
            </div>
        );
    }
}