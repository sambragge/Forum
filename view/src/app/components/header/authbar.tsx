import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { IAuthbarProps } from '../../interfaces';

export default class Authbar extends React.Component<IAuthbarProps, {}> {

    private loggedOutView():JSX.Element{
        return(
            <ul className="authbar four columns">
                <li className="authLightOff" ></li>
                <li><NavLink activeClassName="activePage" to="/login">Login</NavLink></li>
                <li><NavLink activeClassName="activePage" to="/register">Register</NavLink></li>
            </ul>
        );
    }
    private loggedInView():JSX.Element{
        return(
            <ul className="authbar four columns">
                <li className="authLightOn" ></li>
                <li><a onClick={this.onLogout.bind(this)}>Logout</a></li>
                <li><NavLink activeClassName="activePage" to={'/profile/'+this.props.user._id}>Profile</NavLink></li>
            </ul>
        );
    }

    private onLogout():void{
        this.props.logout();
    }

    public render():JSX.Element{

        return this.props.user !== null ? 
        this.loggedInView():
        this.loggedOutView();
        
    }
}