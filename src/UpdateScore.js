import React from "react";
import axios from 'axios';
import Select from 'react-select';
import UpdatedScore from './UpdatedScore';

export class UpdateScore extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            selectedOption:null,
            stud_scores:false,
            scores:[],
        }
        this.handleChange2 = this.handleChange2.bind(this);
    }
    componentWillMount(){
        var subjectName = this.state.subject + " " + "by" + " " + this.state.user;
        this.setState({
            subject:subjectName
        })
           axios.get('http://localhost:4495/getScoreHeader/'+subjectName).then((f) => {
                if(f){
                    //console.log(f.data);
                    var x = [];
                    for(let y in f.data)
                    {
                        let q = {
                            value:f.data[y],
                            label:f.data[y]
                        }
                        x.push(q);
                    }
                    this.setState({
                        scores:x
                    })
                    //console.log(x);
                    }    
           })
    }

    handleChange2 = (selectedOption) => {
        this.setState({ 
            selectedOption
        });
        this.setState({
            stud_scores:true
        })
      }

    render(){

        return(
           <div>
               <div>
               Select the score to be updated
               <br/>
               <Select
                name="subjects"
                value={this.state.selectedOption}
                onChange={this.handleChange2}
                options={this.state.scores}
                />
                </div>
                <br/>
                {
                    (this.state.stud_scores ? (<UpdatedScore test={this.state.selectedOption} subject={this.state.subject} />) : (" "))
                }
                
            </div>
        )
    }

}