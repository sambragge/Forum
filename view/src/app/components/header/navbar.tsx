import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { INavbarProps } from '../../interfaces';
import Loading from '../loading';

export default class Navbar extends React.Component<INavbarProps, {}> {

    private main():JSX.Element{
        let forums = this.props.forums.map((forum, i)=>{
            return <li key={'forum'+i}><NavLink activeClassName="activePage" to={"/forum/"+forum._id}>{forum.topic}</NavLink></li>
        })

        return(
            <ul className="navbar eight columns">
                <li><NavLink exact activeClassName="activePage" to="/">Home</NavLink></li>
                {forums.length > 0 ? forums:<li>No Forums...</li>}
                <li className="creationLink"><a href="#">create a forum</a></li>
            </ul>
        );
    }

    public render():JSX.Element{
        return this.props.forums ? this.main():<Loading/>
    }
}