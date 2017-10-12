import * as React from 'react';
import { api, errors } from '../../util';
import { IHomePageState, IHomePageProps, IPost, IForum } from '../../interfaces';
import Post from '../post';
import Loading from '../loading';

export default class HomePage extends React.Component<IHomePageProps, IHomePageState> {


    private posts:IPost[];

    constructor(props:IHomePageProps){
        super(props);
        this.state = {
            filter:null,
            posts:null,
        }
        this.getPosts = this.getPosts.bind(this);
    }


    componentDidMount():void{

        this.getPosts();
        console.log("Homepage mounted ", this);
    }

    private getPosts():Promise<boolean>{
        return new Promise((resolve)=>{
            api.getPosts()
            .then(res=>{
                res.success ? this.setState(()=>({posts:res.payload})):errors.handle(res.payload);
                resolve(res.success);
            });
        });
    }

    private handleFilterChange(e:any):void{
        this.setState(()=>({
            filter:e.target.value
        }));
    }

    private header():JSX.Element{
        return(
            <div className="pageHeader">
                <input onChange={this.handleFilterChange.bind(this)} type="text" placeholder="Search..." name="filter"/>
            </div>
        );
    }
    private filterMethod(post:IPost):boolean{
        if(this.state.filter){
            return post.title.toLowerCase().startsWith(this.state.filter.toLowerCase());
        }else{
            return true
        }
    }

    private postList():JSX.Element{
        const posts = this.state.posts.filter(this.filterMethod.bind(this)).map((post, i)=>{
            const props = {
                data:post,
                className:"standardPost",
                goToPostPage:this.props.goToPostPage,
                editable:this.props.user && post._creator === this.props.user._id,
            }

            return <li key={'post'+i} ><Post {...props} /></li>
        });

        return(
            <ul>
                {posts.length > 0 ? posts:<li>No Posts...</li>}
            </ul>
        );
    }

    private main():JSX.Element{
        return(
            <div className="homePage">
                {this.header()}
                {this.postList()}
            </div>
        );
    }

    public render(){
        return this.state.posts ? this.main():<Loading/>
    }
}