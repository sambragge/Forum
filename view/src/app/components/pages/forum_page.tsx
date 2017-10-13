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
        }
        this.getForum = this.getForum.bind(this);
    }

    componentDidMount(){
        console.log("ForumPage Mounted: ", this);
        this.getForum();
    }

    // ==== PRIVATE METHODS ====\\
    private handleChange(e:any):void{
        const newState:any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(()=>newState);
    }
    private getForum():void{
        api.getForum(this.props.match.params.id)
        .then(res=>{
            if(res.success){
                this.setState(()=>({data:res.payload}))
            }else{
                this.props.history.push("/");
                alert(res.payload);
            }
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
                {this.posts()}
            </div>
        );
    }
    public render(){

        return this.state.data ? this.main():<Loading/>
    }

}