import * as React from 'react';
import { api, errors } from '../../util';
import { IUserEditPageState, IUserEditPageProps, IUpdateUserInfoRequest } from '../../interfaces';
import Loading from '../loading';

export default class UserEditPage extends React.Component<IUserEditPageProps, IUserEditPageState> {

    static initialState: IUserEditPageState = {
        data: null,
        updateDisabled:false,
        username:"",
        state: "",
        city: "",
    }

    constructor(props: IUserEditPageProps) {
        super(props);
        this.state = UserEditPage.initialState;
        this.getUser = this.getUser.bind(this);

        
    }

    componentDidMount(): void {
        this.getUser().then(() => {
            console.log("UserEditPage mounted ", this);
        })
    }

    // Private Methods
    private bindActions():void{
        this.goBack = this.goBack.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.delete = this.delete.bind(this);
    }
    private header(): JSX.Element {
        return (
            <div className="pageHeader row">
                <ul>
                    <li><button onClick={this.goBack} >Cancel</button></li>
                    <li><button disabled={this.state.updateDisabled} onClick={this.handleDelete.bind(this)}>Delete Account</button></li>
                </ul>
            </div>
        );
    }
    private goBack(): void {
        this.props.history.goBack();
    }
    private getUser(): Promise<boolean> {
        return new Promise((resolve) => {
            api.getUser(this.props.match.params.id)
                .then(res => {
                    res.success ?
                        this.setState(() => ({ data: res.payload })) : errors.handle(res.payload)
                    resolve(res.success);
                });
        });
    }

    private updateInfo(updateReq:IUpdateUserInfoRequest):Promise<boolean>{
        return new Promise((resolve)=>{
            api.updateUserInfo(updateReq)
            .then(res=>{
                !res.success ? errors.handle(res.payload):this.goBack;
                resolve(res.success)
            });
        });
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        this.setState(()=>({updateDisabled:true}));
        const confirmation = confirm("Are you sure you want to save these changes?");
        confirmation &&
            this.updateInfo({
                _id: this.state.data._id,
                username:this.state.username,
                location: {
                    state: this.state.state,
                    city: this.state.city,
                }
            });
    }
    private handleChange(e: any): void {
        const newState: any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(() => newState);
    }

    private delete():Promise<boolean>{
        return new Promise((resolve)=>{
            api.deleteUser(this.state.data._id)
            .then(res=>{
                res.success ? this.props.goHome():errors.handle(res.payload);
                resolve(res.success)
            });
        });
    }

    private handleDelete(): void {
        const confirmation = confirm("Are you sure? This will delete any Forums, Posts and Comments you have created as well.")
        confirmation &&
            this.delete();
    }
    // Views
    private content(): JSX.Element {
        return (
            <form className="updateForm">
                <input onChange={this.handleChange.bind(this)} type="text" name="username" defaultValue={this.state.data.username} />
                <input onChange={this.handleChange.bind(this)} type="text" name="state" defaultValue={this.state.data.location.state} />
                <input onChange={this.handleChange.bind(this)} type="text" name="city" defaultValue={this.state.data.location.city} />
                <input type="submit" value="update user" />
            </form>
        );
    }

    private main(): JSX.Element {
        return (
            <div className="userEditPage">
                {this.header()}
                {this.content()}
            </div>
        );
    }

    public render(): JSX.Element {
        return this.state.data ? this.main() : <Loading />
    }
}