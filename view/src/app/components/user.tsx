import * as React from 'react';
import { IUserProps } from '../interfaces';
import { helpers } from '../util';


export default class User extends React.Component<IUserProps, {}>{
    public render(){
        const x = this.props.data;

        return(
            <div className={this.props.className} onClick={this.handleClick.bind(this)}>
                <ul>
                    <li>{x.gender}</li>
                    <li>{x.username}</li>
                    <li>{x.email}</li>
                    <li>{x.location.city} {x.location.state}</li>
                </ul>
            </div>
        );
    }


    private handleClick():void{
        console.log("=== User data is: ", this.props.data);
        console.log("=== Going to profile with id: ", this.props.data._id)
        this.props.goToProfile(this.props.data._id);
    }
}