import * as React from 'react';
import { ICommentProps } from '../interfaces';
import { Link } from 'react-router-dom';


const Comment:React.SFC<ICommentProps> = (props) => {
    return(
        <div className={props.className}>
            <ul>
                <li>{props.data.content}</li>
                <li>By: {props.data.creator.username}</li>
            </ul>
            {props.editable && 
            <Link className="edit" to={"/comment/"+props.data._id+"/edit"}>Edit Comment</Link>}
        </div>
    );

}

export default Comment;