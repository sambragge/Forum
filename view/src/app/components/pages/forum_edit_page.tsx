import * as React from 'react';
import { api, errors } from '../../util';
import { IForumEditPageState, IForumEditPageProps, IUpdateForumRequest } from '../../interfaces';
import Loading from '../loading';

export default class ForumEditPage extends React.Component<IForumEditPageProps, IForumEditPageState> {

    static initialState: IForumEditPageState = {
        data: null,
        updateDisabled:false,
        inputs:{
            topic: "",
            description: "",
        }
    }

    constructor(props: IForumEditPageProps) {
        super(props);
        this.state = ForumEditPage.initialState;
        this.bindActions();
    }

    componentDidMount(): void {
        this.getForum().then((success) => {
            success && this.initializeInputs();
        })
        console.log("ForumEditPage mounted ", this);
    }

    // Private Methods
    private bindActions():void{
        this.getForum = this.getForum.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    private initializeInputs():void{
        const inputs:any = this.state.inputs;
        inputs.topic = this.state.data.topic;
        inputs.description = this.state.data.description;
        this.setState(()=>({inputs:inputs}));
    }
    private goBack(): void {
        this.props.history.goBack();
    }
    private getForum(): Promise<boolean> {
        return new Promise((resolve) => {
            api.getForum(this.props.match.params.id)
                .then(res => {
                    res.success ?
                        this.setState(() => ({ data: res.payload })) : errors.handle(res.payload)
                    resolve(res.success);
                });
        });
    }
    private updateForum():void{
        this.props.updateForum({
            ...this.state.inputs,
            _id:this.state.data._id
        });
    }
    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.setState(()=>({updateDisabled:true}));
        const confirmation = confirm("Are you sure you want to save these changes?");
        confirmation && this.updateForum();

    }
    private handleInputChange(e: any): void {
        const inputs: any = this.state.inputs;
        inputs[e.target.name] = e.target.value;
        this.setState(() => ({inputs:inputs}));
    }
    
    private handleDelete():void{
        const confirmation = confirm("Are you sure you want to delete this forum? This will also delete any posts and comments associated with it.");
        confirmation && this.props.deleteForum(this.state.data._id);
    }

    // Views
    private header(): JSX.Element {
        return (
            <div className="pageHeader row">
                <ul>
                    <li><button onClick={this.goBack.bind(this)}>Cancel</button></li>
                    <li><button onClick={this.handleDelete.bind(this)} >Delete Forum</button></li>
                </ul>
            </div>
        );
    }
    private content(): JSX.Element {
        return (
            <form onSubmit={this.handleSubmit.bind(this)} className="updateForm">
                <input onChange={this.handleInputChange.bind(this)} type="text" name="topic" value={this.state.inputs.topic} />
                <textarea onChange={this.handleInputChange.bind(this)} name="description" value={this.state.inputs.description}></textarea>
                <input type="submit" value="update forum"/>
            </form>
        );
    }

    private main(): JSX.Element {
        return (
            <div className="forumEditPage">
                {this.header()}
                {this.content()}
            </div>
        );
    }

    public render(): JSX.Element {
        return this.state.data ? this.main() : <Loading />
    }
}