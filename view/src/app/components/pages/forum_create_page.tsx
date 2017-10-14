import * as React from 'react';
import { api, errors } from '../../util';
import { IForumCreatePageProps, IForumCreatePageState } from '../../interfaces';

export default class ForumCreatePage extends React.Component<IForumCreatePageProps, IForumCreatePageState>{


    constructor(props:IForumCreatePageProps){
        super(props);
        this.state = {
            topic:"",
            description:"",
        }
    }
    private handleChange(e:any):void{
        const newState:any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(()=>newState);
    }
    private handleSubmit(e:Event):void{
        e.preventDefault()
        this.props.createForum({
            _creator:this.props.user._id,
            topic:this.state.topic,
            description:this.state.description,
        });
    }

    private creationForm():JSX.Element{
        return(
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input onChange={this.handleChange.bind(this)} name="topic" type="text" placeholder="Topic..."/>
                <textarea onChange={this.handleChange.bind(this)} name="description" placeholder="Description"></textarea>
                <input type="submit" value="create forum"/>
            </form>
        );
    }

    public render():JSX.Element{
        return(
            <div className="forumCreatePage">
                <h1>Can't find the right forum for you? Create your own!</h1>
                <h3>Simply specify a unique topic, and give a short description of what the forum is about.</h3>
                {this.creationForm()}
            </div>
        );
    }
}