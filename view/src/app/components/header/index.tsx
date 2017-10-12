import * as React from 'react';
import { IHeaderProps } from '../../interfaces';
import Navbar from './navbar';
import Authbar from './authbar';

export default class Header extends React.Component<IHeaderProps, {}> {
    public render(){

        const authbarProps = {
            logout:this.props.logout,
            user:this.props.user,
        }
        const navbarProps = {
            forums:this.props.forums,
        }


        return(
            <div className="header row">
                <Navbar {...navbarProps} />
                <Authbar {...authbarProps}/>
            </div>
        );
    }
}