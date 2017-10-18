import * as React from 'react';
import { IForumPageProps, IForumPageState, IPost } from '../../interfaces';
import { api, errors } from '../../util';
import { Link } from 'react-router-dom';
import Loading from '../loading';
import Post from '../post';

export default class ForumPage extends React.Component<IForumPageProps, IForumPageState> {

    constructor(props:IForumPageProps){
        super(props);
        this.state = {
            data:null,
            filter:null,
            inputs:{
                title:"",
                content:"",
            }
        }
        this.getForum = this.getForum.bind(this);
        this.createPost = this.createPost.bind(this);
    }

    componentDidMount(){
        console.log("ForumPage Mounted: ", this);
        this.getForum();
    }

    // ==== PRIVATE METHODS ====\\
    private handleInputChange(e:any){
        const inputs:any = this.state.inputs;
        inputs[e.target.name] = e.target.value;
        this.setState(()=>({inputs:inputs}));
    }
    private handleFilterChange(e:any):void{
        this.setState(()=>({filter:e.target.value}));
    }

    private createPost():Promise<boolean>{
        return new Promise((resolve)=>{
            api.createPost({
                ...this.state.inputs, 
                _creator:this.props.user._id,
                _parent:this.state.data._id,
            
            })
            .then((res)=>{
                res.success ?
                this.getForum():
                errors.handle(res.payload);
                resolve(res.success);
            });
        });
    }

    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.createPost().then((success)=>{
            // Reset fields
            const form:any = document.getElementById("postCreationForm");
            form.reset();
        })
        
    }
    private getForum():Promise<void>{
        return new Promise((resolve)=>{
            api.getForum(this.props.match.params.topic)
            .then(res=>{
                if(res.success){
                    this.setState(()=>({data:res.payload}))
                }else{
                    this.props.history.push("/");
                    alert(res.payload);
                }
                resolve();
            });
        });
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
    private header():JSX.Element{
        return(
            <div className="pageHeader row">
                <input onChange={this.handleFilterChange.bind(this)} name="filter" type="text" placeholder="Search..."/>
                {this.props.user && this.isMyForum() && // Show the edit button if user is logged in and the creator of this forum
                <Link to={'/forum/'+this.state.data.topic+'/edit'}>Edit Forum</Link>}
            </div>
        );
    }
    private postCreationForm():JSX.Element{
        return(
            <form id="postCreationForm" onSubmit={this.handleSubmit.bind(this)} className="postCreationForm">
                <input onChange={this.handleInputChange.bind(this)} value={this.state.inputs.title} type="text" name="title" placeholder="Post title..."/>
                <textarea onChange={this.handleInputChange.bind(this)} value={this.state.inputs.content} name="content" placeholder="Post content..." ></textarea>
                <input type="submit" value="post it!"/>
            </form>
        );
    }
    private posts():JSX.Element{

        let posts:JSX.Element[];
        if(this.state.data.posts){
            posts = this.state.data.posts.filter(this.filterMethod.bind(this)).map((post, i)=>{
                const props = {
                    data:post,
                    className:"standardPost",
                    editable:this.props.user && post._creator === this.props.user._id
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
                {this.props.user && this.postCreationForm()}
                {this.posts()}
            </div>
        );
    }
    public render(){

        return this.state.data ? this.main():<Loading/>
    }

}