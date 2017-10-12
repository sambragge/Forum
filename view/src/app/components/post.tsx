import * as React from 'react';
import { IPostProps } from '../interfaces';

export default class ForumPost extends React.Component<IPostProps, any> {

    public render(){
        const x = this.props.data;
        return(
            <div className={this.props.className} onClick={this.handleClick.bind(this)}>
                <ul>
                    <li>{x.title}</li>
                    <li>{this.shortContent()}</li>
                    <li>Comments: {x.comments ? x.comments.length:'0'}</li>
                </ul>
            </div>
        );
    }

    private handleClick(e:Event){
        console.log("ForumPost Component calling goToForumPostPage with id as: ", this.props.data._id);
        this.props.goToForumPostPage(this.props.data._id);
    }

    private shortContent():string{
        const characterMax = 30;
        return this.props.data.content.length > characterMax ?
        this.props.data.content.slice(0, characterMax)+'...':
        this.props.data.content;
    }
}