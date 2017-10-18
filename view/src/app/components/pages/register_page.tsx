import * as React from 'react';
import { IRegisterPageProps, IRegisterPageState } from '../../interfaces';
import { api, errors } from '../../util';

export default class RegisterPage extends React.Component<IRegisterPageProps, IRegisterPageState> {

    static initialState:IRegisterPageState = {
        gender:"male",
        username:"",
        email:"",
        state:"",
        city:"",
        password:"",
        confirmPassword:"",
    }

    constructor(props:IRegisterPageProps){
        super(props);
        this.state = RegisterPage.initialState;
    }

    public render():JSX.Element{
        return(
            <div className="registerPage">
                <form onSubmit={this.handleSubmit.bind(this)}>

                    <select name="gender" onChange={this.handleChange.bind(this)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <input 
                    type="text" 
                    name="username" 
                    placeholder="Username..." 
                    onChange={this.handleChange.bind(this)}/>


                    <input 
                    type="text" 
                    name="email" 
                    placeholder="Email..." 
                    onChange={this.handleChange.bind(this)}/>

                    <input 
                    type="text" 
                    name="state" 
                    placeholder="State..." 
                    onChange={this.handleChange.bind(this)}/>

                    <input 
                    type="text" 
                    name="city" 
                    placeholder="City..." 
                    onChange={this.handleChange.bind(this)}/>

                    <input 
                    type="password" 
                    name="password" 
                    placeholder="Password..." 
                    onChange={this.handleChange.bind(this)}/>

                    <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Confirm Password..." 
                    onChange={this.handleChange.bind(this)}/>

                    <input type="submit" value="register"/>
                </form>
            </div>
        );
    }

    private createUser():Promise<boolean>{
        return new Promise((resolve)=>{
            api.createUser({
                gender: this.state.gender,
                username:this.state.username,
                email:this.state.email,
                location:{
                    state:this.state.state,
                    city:this.state.city,
                },
                password:this.state.password,
                confirmPassword:this.state.confirmPassword,
            }).then(res=>{
                res.success ? this.props.login({
                    email:this.state.email,
                    password:this.state.password,
                }):errors.handle(res.payload);
                resolve(res.payload);
            });
        });
    }

    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.createUser();

    }
    private handleChange(e:any):void{
           let newState:any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(()=>(newState));
    }
}