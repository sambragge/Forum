import * as React from 'react';
import { IForumPageProps, IForumPageState, IPost } from '../../interfaces';
import { api } from '../../util';
import { Link } from 'react-router-dom';
import Loading from '../loading';
import Post from '../post';

export default class ForumPage extends React.Component<IForumPageProps, IForumPageState> {

    constructor(props:IForumPageProps){
        super(props);
        this.state = {
            data:null,
            filter:null,
            title:"",
            content:"",
        }
        this.getForum = this.getForum.bind(this);
    }

    componentDidMount(){
        console.log("ForumPage Mounted: ", this);
        this.getForum();
    }

    // ==== PRIVATE METHODS ====\\
    private handleChange(e:any):void{
        const n:string = e.target.name,
            v:string = e.target.value,
            newState:any = this.state;
        newState[n] = v;
        this.setState(()=>newState);
    }
    private handleSubmit(e:Event){
        e.preventDefault();
        this.props.createPost({
            _creator:this.props.user._id,
            _parent:this.state.data._id,
            title:this.state.title,
            content:this.state.content,
        });
    }
    private getForum():void{
        console.log("=== Getting user with id : ", this.props.match.params.id);
        api.getForum(this.props.match.params.id)
        .then(res=>{
            res.success ? this.setState(()=>({data:res.payload})):this.props.goToForumsPage().then(()=>{alert(res.payload)});
        });
    }
    private createPostForm():JSX.Element{
        return(
            <form onSubmit={this.handleSubmit.bind(this)}>
                <input onChange={this.handleChange.bind(this)} type="text" name="title" placeholder="Title..."/>
                <textarea onChange={this.handleChange.bind(this)} name="content" placeholder="Content..."></textarea>
                <input type="submit" value="post it"/>
            </form>
        );
    }
    private isMyForum():boolean{
        return this.state.data._creator === this.props.user._id;
    }
    private filterMethod(post:IPost):boolean{
        if(this.state.filter){
            return post.title.toLowerCase().startsWith(this.state.filter.toLowerCase());
        }else{
            return true;
        }

    }

    //==== VIEWS ====\\
    private edit():JSX.Element{
        const id = this.state.data._id;
        return <Link to={'/forum/'+id+'/edit'}>Edit</Link>;
    }
    private header():JSX.Element{
        return(
            <div className="pageHeader row">
                <input onChange={this.handleChange.bind(this)} name="filter" type="text" placeholder="Search..."/>
                {this.props.user && this.isMyForum() && this.edit()}
            </div>
        );
    }
    private posts():JSX.Element{

        let posts:JSX.Element[];
        if(this.state.data.posts){
            posts = this.state.data.posts.filter(this.filterMethod.bind(this)).map((post, i)=>{
                const props = {
                    data:post,
                    className:"standardForumPost",
                    goToForumPostPage:this.props.goToPostPage,
                    edit:this.props.user && post._creator === this.props.user._id
                }
                return <li key={'post'+i}><Post {...props} /></li>
            });
        }

        return(
            <ul>
                <li>~Posts~</li>
                {posts ? posts:<li>No Posts...</li>}
            </ul>
        );
    }

    private content():JSX.Element{
        const x = this.state.data;
        return(
            <ul className="itemContent">
                <li>{x.topic}</li>
                <li>{x.description}</li>
            </ul>
        );
    }

    private main(){
        
        return(
            <div className="forumPage">
                {this.header()}
                {this.content()}
                {this.props.user && this.createPostForm()}
                {this.posts()}
            </div>
        );
    }
    public render(){

        return this.state.data ? this.main():<Loading/>
    }

}