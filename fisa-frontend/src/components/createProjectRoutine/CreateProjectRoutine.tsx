import React from 'react';
import {
  Dialog,
  Button,
  TextField,
  DialogContent,
  CircularProgress,
  DialogTitle,
  DialogActions,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Routes } from '../../environment';
import {
  setFetchProjectName,
  fetchProject,
  setChosenDocumentUuid,
} from '../../redux/actions';
import {
  getChosenDocumentUuid,
  getServerCommunicationPending,
  getServerCommunicationError,
} from '../../redux/selectors';
import { FrontendReduxStateI, ErrorMessageI } from '../../redux/interfaces';
import ErrorDialogContent from '../errorMessages/ErrorDialogContent';
import UseCaseOverview from '../useCasesOverview/useCaseOverview';

enum CreateProjectStates {
  CHOOSE_USE_CASE,
  ENTER_NAME,
  PENDING,
}

interface CreateProjectRoutineProps {
  open: boolean;
  close: () => void;
  setFetchProjectName: (name: string) => void;
  fetchProject: (uuid: string) => void;
  chosenDocumentUuid: string | undefined;
  fetchPending: boolean;
  fetchError: ErrorMessageI | undefined;
}

function CreateProjectRoutine(props: CreateProjectRoutineProps) {
  const history = useHistory();

  const [routineState, setRoutineState] = React.useState(
    CreateProjectStates.CHOOSE_USE_CASE
  );

  const closeRoutine = () => {
    props.close();
    setTimeout(() => setRoutineState(CreateProjectStates.CHOOSE_USE_CASE), 500);
  };

  const createProject = (name: string) => {
    setRoutineState(CreateProjectStates.PENDING);
    props.setFetchProjectName(name);

    if (props.chosenDocumentUuid) {
      props.fetchProject(props.chosenDocumentUuid);
    }
  };

  let content;
  switch (routineState) {
    case CreateProjectStates.CHOOSE_USE_CASE:
      content = (
        <ChooseDefinition
          cancel={closeRoutine}
          next={() => setRoutineState(CreateProjectStates.ENTER_NAME)}
        />
      );
      break;
    case CreateProjectStates.ENTER_NAME:
      content = (
        <AddProjectName
          back={() => setRoutineState(CreateProjectStates.CHOOSE_USE_CASE)}
          submit={(name) => createProject(name)}
        />
      );
      break;
    case CreateProjectStates.PENDING:
      if (props.fetchPending) {
        content = (
          <DialogContent style={{ textAlign: 'center' }}>
            <CircularProgress />
          </DialogContent>
        );
      } else if (props.fetchError !== undefined) {
        content = <ErrorDialogContent error={props.fetchError} />;
      } else {
        history.push(Routes.PROJECT);
        content = <div />;
      }
      break;
    default:
      content = <div>WrongState</div>;
  }

  return <Dialog open={props.open}>{content}</Dialog>;
}

interface CoosDefinitionProps {
  cancel: () => void;
  next: () => void;
  setChosenDocumentUuid: (uuid: string) => void;
}

const ChooseDefinition = connect(null, { setChosenDocumentUuid })(
  ChooseDefinitionRaw
);

function ChooseDefinitionRaw(props: CoosDefinitionProps) {
  const { t } = useTranslation(['menus', 'general']);
  const [selected, setSelected] = React.useState('');
  return (
    <>
      <DialogTitle>{t('chooseAUsecase')}</DialogTitle>
      <DialogContent>
        <UseCaseOverview
          selected={selected}
          setSelected={setSelected}
          removable={false}
        />
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={props.cancel}>
          {t('cancel')}
        </Button>
        <Button
          disabled={selected === ''}
          type="submit"
          onClick={() => {
            props.setChosenDocumentUuid(selected);
            props.next();
          }}
        >
          {t('next')}
        </Button>
      </DialogActions>
    </>
  );
}

interface AddProjectNameProps {
  back: () => void;
  submit: (name: string) => void;
}

const addProjectNameStyle = makeStyles(() => ({
  root: {
    width: 300,
  },
  nameForm: {
    textAlign: 'center',
    marginBottom: 5,
  },
}));

function AddProjectName(props: AddProjectNameProps) {
  const { t } = useTranslation('general');
  const [name, setName] = React.useState('');

  const classes = addProjectNameStyle();

  return (
    <div className={classes.root}>
      <DialogTitle id="enterNameTitle">
        {t('pleaseEnterProjectName')}
      </DialogTitle>
      <DialogContent>
        <form className={classes.nameForm}>
          <TextField
            autoFocus={true}
            onKeyDown={(e) => {
              switch (e.key) {
                case 'Enter':
                  e.stopPropagation();
                  if (name !== '') {
                    props.submit(name);
                  }
                  break;
                case 'Escape':
                  props.back();
              }
            }}
            id="standard-basic"
            label="Project name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={props.back}>
          {t('back')}
        </Button>
        <Button
          type="submit"
          disabled={name === ''}
          onClick={() => props.submit(name)}
        >
          {t('create')}
        </Button>
      </DialogActions>
    </div>
  );
}

const mapStateToProps = (state: FrontendReduxStateI) => ({
  chosenDocumentUuid: getChosenDocumentUuid(state),
  fetchPending: getServerCommunicationPending(state),
  fetchError: getServerCommunicationError(state),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = {
  setFetchProjectName,
  fetchProject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProjectRoutine);
