import * as React from 'react';
import { api, errors } from '../../util';
import Loading from '../loading';

export default class PostEditPage extends React.Component<any, any>{

    constructor(props:any){
        super(props);
        this.state = {
            data:null,
            inputs:{
                title:"",
                content:"",
            }
        }
        this.bindActions();
    }

    componentDidMount(){
        this.getPost().then((success)=>{
            success && this.initializeInputs();
        });

        console.log("PostEditPage Mounted : ", this);
    }

    private bindActions(): void {
        this.getPost = this.getPost.bind(this);
        this.goBack = this.goBack.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.delete = this.delete.bind(this);
    }
    private initializeInputs():void{
        const inputs:any = this.state.inputs;
        inputs.title = this.state.data.title;
        inputs.content = this.state.data.content
        this.setState(()=>({inputs:inputs}));
    }

    private getPost():Promise<boolean>{
        return new Promise((resolve)=>{
            api.getPost(this.props.match.params.id)
            .then(res=>{
                res.success ?
                this.setState(()=>({data:res.payload})):errors.handle(res.payload);
                resolve(res.success);
            });
        });
    }
    private goBack():void{
        this.props.history.goBack();
    }
    private updateInfo():Promise<boolean>{
        return new Promise((resolve)=>{
            api.updatePost({
                ...this.state.inputs,
                _id:this.state.data._id,
            })
            .then(res=>{
                res.success ?
                this.goBack:errors.handle(res.payload);
                resolve(res.success)
            });
        });
    }
    private delete():Promise<boolean>{
        return new Promise((resolve)=>{
            api.deletePost(this.state.data._id)
            .then(res=>{
                res.success ?
                this.props.history.push("/"):errors.handle(res.payload);
                resolve(res.success);
            });
        });
    }

    private header():JSX.Element{
        return(
            <div className="pageHeader row">
                <ul>
                    <li><button onClick={this.goBack} >Cancel</button></li>
                    <li><button onClick={this.handleDelete.bind(this)} >Delete</button></li>
                </ul>
            </div>
        );
    }

    private handleInputChange(e:any):void{
        const inputs:any = this.state.inputs;
        inputs[e.target.name] = e.target.value;
        this.setState(()=>({inputs:inputs}));
    }
    private handleSubmit(e:Event):void{
        e.preventDefault();
        const confirmation = confirm("Are you sure you want to save these changes?");
        confirmation && this.updateInfo();
    }
    private handleDelete(e:Event):void{}


    private updateForm():JSX.Element{
        return(
            <form onSubmit={this.handleSubmit.bind(this)} >
                <input onChange={this.handleInputChange.bind(this)} type="text" name="title" placeholder="post title..." value={this.state.inputs.title} />
                <textarea onChange={this.handleInputChange.bind(this)} name="content" placeholder="post content..." value={this.state.inputs.content}/>
                <input type="submit" value="update post"/>
            </form>
        );
    }

    private main():JSX.Element{
        return(
            <div className="postEditPage">
                {this.header()}
                {this.updateForm()}
            </div>
        );
    }

    public render():JSX.Element{
        return this.state.data ? this.main():<Loading/>
    }

}