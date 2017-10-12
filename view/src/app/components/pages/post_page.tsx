import * as React from 'react';
import { IPostPageState, IPostPageProps, IComment } from '../../interfaces';
import { api } from '../../util';
import Loading from '../loading';
import Comment from '../comment';

export default class ForumPostPage extends React.Component<IPostPageProps, IPostPageState> {

    constructor(props: IPostPageProps) {
        super(props);
        this.state = {
            data: null,
            comment:"",
        }
    }

    componentDidMount() {
        console.log("=== PostPage Mounted: ", this);
        this.getPost()
    }

    private getPost(): void {
        
        api.getPost(this.props.match.params.id)
            .then(res => {
                res.success ? this.setState(() => ({ data: res.payload })) : this.props.goToForumsPage().then(()=>{alert(res.payload)});
            });
    }

    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.props.createComment({
            _creator:this.props.user._id,
            _parent:this.state.data._id,
            content:this.state.comment,
        });
    }

    private handleChange(e:any){
        const newState:any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(()=>(newState));
    }

    private handleDelete():void{
        this.props.deletePost(this.state.data._id)
    }

    private comments():JSX.Element{
        const comments = this.state.data.comments.map((comment, i)=>{
            const props = {
                data:comment,
                deleteComment:this.props.deleteComment,
                className:"standardComment",
                edit:this.props.user && comment._creator === this.props.user._id
            }
            return <li key={'comment'+i}><Comment {...props} /></li>
        });
        return(
            <ul className="comments">
                {comments}
            </ul>
        );
    }

    private header():JSX.Element{
        return(
            <div className="pageHeader row" >
                {this.props.user && this.isMyPost() && this.edit() }
            </div>
        );
    }

    private createCommentForm():JSX.Element{
        return (
        <form className="createCommentForm" onSubmit={this.handleSubmit.bind(this)}>
            <textarea onChange={this.handleChange.bind(this)} name="comment" placeholder="Leave a comment..."></textarea>
            <input type="submit" value="submit"/>
        </form>
        );

    }

    private isMyPost():boolean{
        return this.state.data._creator === this.props.user._id;
    }

    private edit():JSX.Element{
        return <a className="edit" href="#">Edit</a>;
    }


    private main(){
        
        return (
            <div className="forumPostPage">
                {this.header()}
                {this.content()}
                {this.props.user && this.createCommentForm()}
                {this.state.data.comments ? this.comments():<h6>No Comments...</h6>}
            </div>
        );
    }

    private content():JSX.Element{
        const x = this.state.data;
        return(
            <ul className="itemContent">
                <li>{x.title}</li>
                <li>{x.content}</li>
                <li>By: {x.creator.firstName} {x.creator.lastName}</li>
            </ul>
        );
    }


    public render() {
        return this.state.data ? this.main():<Loading/>
    }
}