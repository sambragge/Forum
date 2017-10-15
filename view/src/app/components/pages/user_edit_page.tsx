import * as React from 'react';
import { api, errors } from '../../util';
import { IUserEditPageState, IUserEditPageProps, IUpdateUserInfoRequest } from '../../interfaces';
import Loading from '../loading';

export default class UserEditPage extends React.Component<IUserEditPageProps, IUserEditPageState> {

    static initialState: IUserEditPageState = {
        data: null,
        updateDisabled: false,
        inputs:{
            username: "",
            state: "",
            city: "",
        }
    }

    constructor(props: IUserEditPageProps) {
        super(props);
        this.state = UserEditPage.initialState;
        this.bindActions();


    }

    componentDidMount(): void {
        this.getUser().then((success)=>{
            success && this.initializeInputs();
        })
        console.log("UserEditPage mounted ", this);
    }

    // Private Methods
    private bindActions(): void {
        this.goBack = this.goBack.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.delete = this.delete.bind(this);
    }
    private initializeInputs():void{
        const inputs:any = this.state.inputs;
        inputs.username = this.state.data.username;
        inputs.state = this.state.data.location.state;
        inputs.city = this.state.data.location.city;
        this.setState(()=>({inputs:inputs}));
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

    private updateInfo(updateReq: IUpdateUserInfoRequest): Promise<boolean> {
        return new Promise((resolve) => {
            api.updateUserInfo(updateReq)
                .then(res => {
                    !res.success ? errors.handle(res.payload) : this.props.history.push("/profile/"+this.state.data._id);
                    resolve(res.success)
                });
        });
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        this.setState(() => ({ updateDisabled: true }));
        const confirmation = confirm("Are you sure you want to save these changes?");
        confirmation &&
            this.updateInfo({
                _id: this.state.data._id,
                username: this.state.inputs.username,
                location: {
                    state: this.state.inputs.state,
                    city: this.state.inputs.city,
                }
            });
    }
    private handleInputChange(e: any): void {
        const inputs: any = this.state.inputs;
        inputs[e.target.name] = e.target.value;
        this.setState(() => ({inputs:inputs}));
    }

    private delete(): Promise<boolean> {
        return new Promise((resolve) => {
            api.deleteUser(this.state.data._id)
                .then(res => {
                    res.success ? this.props.logout(1) :
                        errors.handle(res.payload);
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
    private updateForm(): JSX.Element {
        return (
            <form  onSubmit={this.handleSubmit.bind(this)} className="updateForm">
                <input onChange={this.handleInputChange.bind(this)} type="text" name="username" value={this.state.inputs.username} />
                <input onChange={this.handleInputChange.bind(this)} type="text" name="state" value={this.state.inputs.state} />
                <input onChange={this.handleInputChange.bind(this)} type="text" name="city" value={this.state.inputs.city} />
                <input type="submit" value="update user" />
            </form>
        );
    }

    private main(): JSX.Element {
        return (
            <div className="userEditPage">
                {this.header()}
                {this.updateForm()}
            </div>
        );
    }

    public render(): JSX.Element {
        return this.state.data ? this.main() : <Loading />
    }
}