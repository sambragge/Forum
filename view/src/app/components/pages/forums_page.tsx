import * as React from 'react';
import { IForumsPageProps, IForumsPageState, IForum } from '../../interfaces';
import Loading from '../loading';
import Forum from '../forum';

export default class ForumsPage extends React.Component<IForumsPageProps, IForumsPageState> {


    static initialState:IForumsPageState = {
        topic: "",
        description: "",
        filter:null,
    }

    constructor(props:IForumsPageProps) {
        super(props);
        this.state = ForumsPage.initialState
    }

    componentDidMount():void{
        console.log("ForumPage mounted", this);
    }

    // ==== PRIVATE METHODS ==== \\
    private handleChange(e: any): void {
        const n: string = e.target.name,
            v: string = e.target.value,
            newState: any = this.state;
        newState[n] = v;
        this.setState(newState);
    }
    private handleSubmit(e: Event): void {
        e.preventDefault();
        this.props.createForum({
            _creator:this.props.user._id,
            topic:this.state.topic,
            description:this.state.description,
        });
    }

    //==== VIEWS ====\\

    // Creation Form
    private creationForm(): JSX.Element {
        return (
            <form onSubmit={this.handleSubmit.bind(this)} className="creationForm">
                <input
                    onChange={this.handleChange.bind(this)}
                    type="text"
                    name="topic"
                    placeholder="Topic..." />

                <textarea
                    className="newForumDescription"
                    onChange={this.handleChange.bind(this)}
                    name="description"
                    placeholder="Description..." />

                <input
                    className="button-primary"
                    type="submit"
                    value="create forum" />

            </form>
        );
    }

    private header():JSX.Element{
        return(
            <div className="pageHeader row">
                <input onChange={this.handleChange.bind(this)} type="text" name="filter" placeholder="Search..."/>
            </div>
        );
    }

    private filterMethod(forum:IForum):boolean{
        if(this.state.filter){

            // return forum.topic.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1;
            return forum.topic.toLowerCase().startsWith(this.state.filter.toLowerCase())
        }else{
            return true;
        }
        
    }

    private forumsList():JSX.Element{

        const forums:JSX.Element[] = this.props.forums.filter(this.filterMethod.bind(this)).map((forum, i) => {
            const props = {
                data: forum,
                className: "standardForum",
                goToForumPage: this.props.goToForumPage,
                edit:this.props.user && forum._creator === this.props.user._id
            }
            return <li key={'forum' + i} ><Forum  {...props} /></li>
        });

        return(
            <ul>
                {forums.length > 0 ? forums:<li>No forums here...</li>}
            </ul>
        );
        
    }
    
    public render(): JSX.Element {
        return (
            <div className="forumsPage">
                {this.header()}
                {this.props.user && this.creationForm()}
                {this.props.forums ? this.forumsList():<Loading/>}
            </div>
        );
    };
};