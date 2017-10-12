import * as React from 'react';
import { ICommentProps } from '../interfaces';


export default class ForumComment extends React.Component<ICommentProps, {}> {
    public render():JSX.Element{
        const x = this.props.data;
        return(
            <div className={this.props.className}>
                <ul>
                    <li>{x.content}</li>
                    <li>By: {x.creator.username}</li>
                </ul>
                {this.props.editable && this.edit()}
            </div>
        );
    }

    private edit():JSX.Element{
        return <a className="edit" href="#">Edit</a>;
    }
}