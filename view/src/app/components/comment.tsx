import * as React from 'react';
import { ICommentProps } from '../interfaces';


export default class ForumComment extends React.Component<ICommentProps, {}> {
    public render():JSX.Element{
        const x = this.props.data;
        return(
            <div className={this.props.className}>
                <ul>
                    <li>{x.content}</li>
                    <li>By: {x.creator.firstName} {x.creator.lastName}</li>
                </ul>
                {this.props.edit && this.edit()}
            </div>
        );
    }

    private delete():void{
        this.props.deleteComment(this.props.data._id);
    }

    private edit():JSX.Element{
        return <a className="edit" href="#">Edit</a>;
    }
}