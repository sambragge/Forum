import * as React from 'react';
import { IForumProps } from '../interfaces';

export default class Forum extends React.Component <IForumProps, any> {
    public render(){
        const x = this.props.data;
        return(
            <div className={this.props.className} onClick={this.handleClick.bind(this)}>
                <ul>
                    <li>{x.topic}</li>
                    <li>{this.shortDescription()}</li>
                    <li>Posts: {x.posts ? x.posts.length:'0'}</li>
                    <li>By: {x.creator.username}</li>
                </ul>
            </div>
        );
    }

    private handleClick(e:Event):void{
        this.props.goToForumPage(this.props.data._id);
    }

    private shortDescription():string{
        const characterMax = 30;
        return this.props.data.description.length > characterMax ?
        this.props.data.description.slice(0, characterMax)+'...':
        this.props.data.description;
    }
}