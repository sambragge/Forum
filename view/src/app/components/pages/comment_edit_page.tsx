import * as React from 'react';
import { api, errors } from '../../util';
import Loading from '../loading';

export default class CommentEditPage extends React.Component<any, any>{

    constructor(props:any){
        super(props);
        this.state = {
            data:null,
            inputs:{
                content:"",
            }
        }
        this.bindActions();
    }

    componentDidMount(){
        this.getComment().then(success=>{
            success && this.initializeInputs();
        });

        console.log("COMMENT EDIT PAGE MOUNTED! : ", this);
    }

    private bindActions(): void {
        console.log("=== binding actions ===");
        this.getComment = this.getComment.bind(this);
        this.goBack = this.goBack.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.delete = this.delete.bind(this);
    }
    private initializeInputs():void{
        console.log("=== initializing inputs ===");
        const inputs:any = this.state.inputs;
        inputs.content = this.state.data.content
        this.setState(()=>({inputs:inputs}));
    }

    private getComment():Promise<boolean>{
        console.log("=== getting comment ===");
        return new Promise(resolve=>{
            api.getComment(this.props.match.params.id)
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
            api.updateComment({
                ...this.state.inputs,
                _id:this.state.data._id,
            })
            .then(res=>{
                res.success ?
                this.goBack():errors.handle(res.payload);
                resolve(res.success)
            });
        });
    }
    private delete():Promise<boolean>{
        return new Promise((resolve)=>{
            api.deleteComment(this.state.data._id)
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
    private handleDelete(e:Event):void{
        const confirmation = confirm("Are you sure you want to delete this post? This will also delete any comments associated with it.");
        confirmation && this.delete();
    }


    private updateForm():JSX.Element{
        return(
            <form onSubmit={this.handleSubmit.bind(this)} >
                <textarea onChange={this.handleInputChange.bind(this)} name="content" value={this.state.inputs.content}/>
                <input type="submit" value="update comment"/>
            </form>
        );
    }

    private main():JSX.Element{
        return(
            <div className="commentEditPage">
                {this.header()}
                {this.updateForm()}
            </div>
        );
    }

    public render():JSX.Element{
        return this.state.data ? this.main():<Loading/>;
    }

}