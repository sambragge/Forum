import * as React from 'react';
import { api, errors } from '../../util';
import { IForumEditPageState, IForumEditPageProps } from '../../interfaces';
import Loading from '../loading';

export default class ForumEditPage extends React.Component<IForumEditPageProps, IForumEditPageState> {

    static initialState: IForumEditPageState = {
        data: null,
        updateDisabled:false,
        topic: "",
        description: "",
    }

    constructor(props: IForumEditPageProps) {
        super(props);
        this.state = ForumEditPage.initialState;
        this.getForum = this.getForum.bind(this);
    }

    componentDidMount(): void {
        this.getForum().then(() => {
            console.log("ForumEditPage mounted ", this);
        })
    }

    // Private Methods
    private goBack(): void {
        this.props.history.pop();
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
    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.setState(()=>({updateDisabled:true}));
    }
    private handleChange(e: any): void {
        const newState: any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(() => newState);
    }
    

    // Views
    private header(): JSX.Element {
        return (
            <div className="pageHeader row">
                <ul>
                    <li><button onClick={this.goBack.bind(this)}>Cancel</button></li>
                    <li><button disabled={this.state.updateDisabled} >Delete Forum</button></li>
                </ul>
            </div>
        );
    }
    private content(): JSX.Element {
        return (
            <form className="updateForm">
                <input type="text" name="topic" defaultValue={this.state.data.topic} />
                <textarea name="topic" defaultValue={this.state.data.description}></textarea>
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