import * as React from 'react';
import { IPostProps } from '../interfaces';
import { withRouter } from 'react-router-dom';

class Post extends React.Component<IPostProps, any> {

    constructor(props: IPostProps) {
        super(props);

    }

    // Lifecycle
    componentDidMount() { }

    // Private Methods

    private handleParentClick(e: Event): void {
        console.log("in handleParentClick with this.props.data.parent.topic as: ", this.props.data.parent.topic);
        this.props.history.push("/forum/" + this.props.data.parent.topic);
    }
    private handleCommentsClick(e: Event): void {
        console.log("in handleCommentsClick with this.props.data._id as: ", this.props.data._id);
        this.props.history.push("/post/" + this.props.data._id);
    }
    private handleUserClick(e: Event): void {
        this.props.history.push("/profile/" + this.props.data._creator);
    }


    // Views
    private content(): JSX.Element {
        const x = this.props.data;
        return (
            <ul>
                {x.parent && <li><a className="itemLink" onClick={this.handleParentClick.bind(this)} >{'/' + x.parent.topic}</a></li>}
                <li>{x.title}</li>
                <li>{x.content}</li>

                <li><a className="itemLink" onClick={this.handleCommentsClick.bind(this)} >Comments</a> {x.comments ? x.comments.length : '0'}</li>
                <li>by: <a className="itemLink" onClick={this.handleUserClick.bind(this)} >{x.creator.username}</a></li>
            </ul>
        );
    }

    public render() {

        return (
            <div className={this.props.className}>
                {this.content()}
            </div>
        );
    }

    private shortContent(): string {
        const characterMax = 30;
        return this.props.data.content.length > characterMax ?
            this.props.data.content.slice(0, characterMax) + '...' :
            this.props.data.content;
    }
}

export default withRouter(Post);