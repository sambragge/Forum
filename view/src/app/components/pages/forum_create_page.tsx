import * as React from 'react';

export default class ForumCreatePage extends React.Component<any, any>{


    private creationForm():JSX.Element{
        return(
            <form>
                <input name="topic" type="text" placeholder="Topic..."/>
                <textarea name="description" placeholder="Description"></textarea>
            </form>
        );
    }


    public render():JSX.Element{
        return(
            <div className="forumCreatePage">
                <h1>Can't find the right forum for you? Create your own!</h1>
                <h3>Simply specify a unique topic, and give a short description of what the forum is about.</h3>
                {this.creationForm()}
            </div>
        );
    }
}