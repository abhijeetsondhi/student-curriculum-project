import React from "react";
import axios from 'axios';
export class ViewScores extends React.Component{
constructor(props)
    {
        super(props);
        this.state={
            user:localStorage.getItem("user"),
            designation:localStorage.getItem("designation"),
            subject:this.props.match.params.sub,
            marks:[]
        }
    }

    componentWillMount()
    {
        axios.get('http://localhost:4495/viewScore/' + this.state.user + "/" + this.state.subject).then((f) => {
            let res = [];
        if(f === null)
            {
                res = null;
            }
            else
            {
            for(var q in f.data)
            {
                res.push(f.data[q]);
            }
          }
            this.setState({
                marks:res
            });
            console.log(res);
        })
    }

    render()
    {
        return(
            <div>
                Hi {this.state.user}
                <br/>
                {this.state.marks.length > 0 ? <p> You have scored
                <br/>
                <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Exam</th>
      <th scope="col">Score</th>
      <th scope="col">Out Of</th>
    </tr>
     </thead>
    <tbody>
                {
                    this.state.marks.map((value,index) => {
                        return(
                        
                        <tr>
                        <th scope="row">*</th>
                        <td>{value.testname}</td>
                        <td>{value.score}</td>
                        <td>{value.outOf}</td>
                        <td></td>
                        </tr>
                            
                        )
                    })
                }
                </tbody>
                </table> </p>: <p> <b>You are at right place but No Scores uploaded uptill now by Professor</b></p> }
                </div>
        )
    }
}