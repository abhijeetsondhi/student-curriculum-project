import React from 'react';
import { render } from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Link} from 'react-router-dom';
import { Login }  from './Login';
import { Register }  from './Register';
import { Post }  from './Post';
import { Anounce }  from './Anounce';
import { Scores }  from './Scores';
import { SubjectsStudent } from './SubjectsStudent';
import { ViewScores } from './ViewScores';
import { Logout } from './Logout';
import { AddNotes } from './AddNotes';
import { ViewNotes } from './ViewNotes';
import { Homework } from './Homework';
import { ViewHomework } from './ViewHomework';
import { UploadHomework } from './UploadHomework';
import { ViewSubmittedHwk } from './ViewSubmittedHwk';
import { ViewSpecific } from './ViewSpecific';
import { UpdateScore } from './UpdateScore';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component{
    render() {
      return (
          <BrowserRouter>
          <div>
          <Route exact path="/logout" component={Logout}/>
            <Route exact path="/" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/target" component={SubjectsStudent}/>
            <Route path="/post/:sub" component={Post}/>
            <Route path="/announcement/:sub" component={Anounce}/>
            <Route path="/viewScore/:sub" component={ViewScores}/>
            <Route path="/scores/:sub" component={Scores}/>
            <Route path="/homework/:sub" component={Homework}/>
            <Route path="/viewHomework/:sub" component={ViewHomework}/>
            <Route path="/viewNotes/:sub" component={ViewNotes}/>
            <Route path="/homeworkUpload/:sub/:name" component={UploadHomework}/>
            <Route path="/notes/:sub" component={AddNotes}/>
            <Route path="/viewSpecific/:sub/:name" component={ViewSpecific}/>
            <Route path="/viewWork/:sub" component={ViewSubmittedHwk}/>
            <Route path="/updateScore/:sub" component={UpdateScore}/>
            </div>
          </BrowserRouter>
      );
    }
  }

render(<App />, window.document.getElementById('root'));


