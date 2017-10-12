import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default class Navbar extends React.Component<{}, {}> {

    private pages = [
        {name:"Home", link:"/"},
        {name:"Forums", link:"/forums"},
        {name:"Blog", link:"/blog"},
        {name:"About Us", link:"/about"},
    ]

    public render(){

        let navs = this.pages.map((page, i)=>{
            return <li key={'page'+i}><NavLink exact activeClassName="activePage" to={page.link}>{page.name}</NavLink></li>
        })

        return(
            <ul className="navbar eight columns">
                {navs}
            </ul>
        );
    }
}