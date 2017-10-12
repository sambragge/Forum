import * as React from 'react';
import { ILoginPageProps, ILoginPageState } from '../../interfaces';

export default class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {

    constructor(props:ILoginPageProps){
        super(props);

        this.state = {
            email:null,
            password:null,
        }
    }

    public render(){
        return(
            <div className="loginPage">
                <form onSubmit={this.handleSubmit.bind(this)}>

                    <input 
                    type="text" 
                    name="email" 
                    placeholder="email" 
                    onChange={this.handleChange.bind(this)}
                    />

                    <input 
                    type="password" 
                    name="password" 
                    placeholder="password" 
                    onChange={this.handleChange.bind(this)}
                    />

                    <input 
                    type="submit" 
                    value="login"
                    />

                </form>
            </div>
        );
    }

   private handleChange(e:any):void{
        let n:string = e.target.name,
            v:string = e.target.value,
            newState:any = this.state;
            
        newState[n] = v == "" ? null:v;
        this.setState(newState);
    }

    private handleSubmit(e:Event):void{
        e.preventDefault();
        this.props.login(this.state)
    }
}