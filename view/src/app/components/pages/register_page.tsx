import * as React from 'react';
import { IRegisterPageProps, IRegisterPageState } from '../../interfaces';

export default class RegisterPage extends React.Component<IRegisterPageProps, IRegisterPageState> {

    static initialState:IRegisterPageState = {
        gender:"male",
        firstName:"",
        lastName:"",
        email:"",
        state:"",
        city:"",
        zip:"",
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
                    name="firstName" 
                    placeholder="First Name..." 
                    onChange={this.handleChange.bind(this)}/>

                    <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Last Name..." 
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
                    type="text" 
                    name="zip" 
                    placeholder="Zip..." 
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

    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.props.createUser({
            gender: this.state.gender,
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            email:this.state.email,
            location:{
                state:this.state.state,
                city:this.state.city,
                zip:this.state.zip,
            },
            password:this.state.password,
            confirmPassword:this.state.confirmPassword,
        });

    }
    private handleChange(e:any):void{
           let newState:any = this.state;
        newState[e.target.name] = e.target.value;
        this.setState(()=>(newState));
    }
}