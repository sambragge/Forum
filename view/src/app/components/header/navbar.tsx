import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { INavbarProps } from '../../interfaces';
import Loading from '../loading';

export default class Navbar extends React.Component<INavbarProps, {}> {

    private main():JSX.Element{
        let forums = this.props.forums.map((forum, i)=>{
            return <li key={'forum'+i}><NavLink activeClassName="activePage" to={"/forum/"+forum.topic}>{this.replaceUnderscoreWithWhitespace(forum.topic)}</NavLink></li>
        })

        return(
            <ul className="navbar eight columns">
                <li><NavLink exact activeClassName="activePage" to="/">Home</NavLink></li>
                {forums.length > 0 ? forums:<li>No Forums...</li>}
                {this.props.user && <li className="creationLink"><NavLink activeClassName="activePage" to="/forums/create">...create a forum</NavLink></li>}
            </ul>
        );
    }
    private replaceUnderscoreWithWhitespace(str:string):string{
        return str.split("_").join(" ");
    }

    public render():JSX.Element{
        return this.props.forums ? this.main():<Loading/>
    }
}