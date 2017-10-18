import * as React from 'react';
import { IPostPageState, IPostPageProps, IComment } from '../../interfaces';
import { Link } from 'react-router-dom';
import { api, errors } from '../../util';
import Loading from '../loading';
import Comment from '../comment';

export default class ForumPostPage extends React.Component<IPostPageProps, IPostPageState> {

    constructor(props: IPostPageProps) {
        super(props);
        this.state = {
            data: null,
            comment:"",
        }
        this.createComment = this.createComment.bind(this);
    }

    componentDidMount() {
        console.log("=== PostPage Mounted: ", this);
        this.getPost()
    }

    private getPost(): void {
        api.getPost(this.props.match.params.id)
            .then(res => {                
                if(res.success){
                    this.setState(() => ({ data: res.payload }))
                }else{
                    this.props.history.push("/");
                    alert(res.payload);
                }
            });
    }

    private createComment():Promise<boolean>{
        return new Promise((resolve)=>{
            api.createComment({
                _creator:this.props.user._id,
                _parent:this.state.data._id,
                content:this.state.comment,
            }).then(res=>{
                res.success ? this.getPost():errors.handle(res.payload);
                resolve(res.success);
            })
        });
    }

    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.createComment();
    }

    private handleChange(e:any){
        const newState:any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(()=>newState);
    }

    private comments():JSX.Element{
        const comments = this.state.data.comments.map((comment, i)=>{
            const props = {
                data:comment,
                className:"standardComment",
                editable:this.props.user && comment._creator === this.props.user._id
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
                {this.props.user && this.isMyPost() && 
                <Link className="edit" to={"/post/"+this.state.data._id+"/edit"}>Edit Post</Link> }
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
                <li>By: {x.creator.username}</li>
            </ul>
        );
    }


    public render() {
        return this.state.data ? this.main():<Loading/>
    }
}