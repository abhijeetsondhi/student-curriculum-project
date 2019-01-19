import React from "react";
import axios from 'axios';
import Input from './Input';
import Input2 from './Input2';
import { Link,Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
export default class UpdatedScore extends React.Component{
    inputValues = new Map();
   
    constructor(props)
    {
        
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            students:[],
            subject:props.subject,
            score:0,
            outOf:100,
            scoreName:props.test,
            exams:"",
            inputs:[],
            redirect:false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount()
    {
        console.log(this.state.subject);
        var subjectName = this.state.subject;
        axios.get('http://localhost:4495/allScores/'+ this.state.subject + '/' + this.state.scoreName.value).then((f) =>
        {
            var x = f.data;
            var y = x[0].testScore[0].marks;
            this.setState({
                students:y
            })
           
        });
    }

    handleSubmit(event){
    axios.post('http://localhost:4495/updateTheScore',{
        scores:this.state.inputs,
        subjectname:this.state.subject,
        testName:this.state.scoreName.value
    }).then((f) =>
    {
        //console.log(f.data);
    });
        this.setState({
            redirect:true
        })
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            scoreName:nextProps.test,
            subject:nextProps.subject
        })
        axios.get('http://localhost:4495/allScores/'+ nextProps.subject + '/' + nextProps.test.value).then((f) =>
        {
            console.log(f.data);
           var x = f.data;
           var y = x[0].testScore[0].marks;
           this.setState({
            students:y
        })
        });
        //console.log(nextProps);
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
                <form onSubmit={this.handleSubmit}>
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
                        <td>{value.student}</td>
                        <td><Input initialValue={value.score} name={value.student} addValue={this.handleAdd.bind(this)}/></td>
                        <td><Input2 initialValue={value.outOf} name={value.student} addValue={this.handleAdd2.bind(this)}/></td>
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
UpdatedScore.propTypes = {
   test:PropTypes.string,
   subject:PropTypes.string
    };  