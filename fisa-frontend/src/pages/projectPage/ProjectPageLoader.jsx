// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { Prompt, useHistory } from 'react-router-dom';
import ProjectPage from './ProjectPage';
import { getExistsProjectInState, getNotSaved } from '../../redux/selectors';
import { Routes } from '../../environment';

/**
 * The ProjectPage where the project gets defined
 */
class ProjectPageLoader extends React.Component {
  /**
   * Add "ask if the user wonts to leaf page" after Page did mount
   */
  componentDidMount() {
    // eslint-disable-next-line no-console
    console.log('component mount');

    window.addEventListener('beforeunload', this.onUnload);
  }

  /**
   * Remove "ask if the user wonts to leaf page" after Page did unmount
   */

  componentWillUnmount() {
    // eslint-disable-next-line no-console
    console.log('component will unmount');
    window.removeEventListener('beforeunload', this.onUnload);
  }

  /**
   * ActionI to stop leaving page and ask if the user wont to save first.
   * @param {*} e
   */
  onUnload = (e) => {
    e.preventDefault();
    e.returnValue = 'Some changes are not saved';
  };

  render() {
    const page = this.props.projectExists ? (
      <div style={{ height: '100vh' }}>
        <Prompt
          when={this.props.notSaved}
          message={() => 'Are you sure you want to leave?'}
        />
        <ProjectPage />
      </div>
    ) : (
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      <ToHomePage />
    );
    return page;
  }
}

function ToHomePage() {
  const history = useHistory();
  history.push(Routes.ROOT);
  return null;
}

const mapStateToProps = (state) => ({
  projectExists: getExistsProjectInState(state),
  notSaved: getNotSaved(state),
});

export default connect(mapStateToProps)(ProjectPageLoader);
