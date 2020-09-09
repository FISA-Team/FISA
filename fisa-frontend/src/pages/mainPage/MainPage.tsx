import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Grid, Typography, Paper, Snackbar } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { loadAutoSave } from '../../redux/actions/projectActions';
import { FrontendReduxStateI, ErrorMessageI } from '../../redux/interfaces';
import SavedProjectsOverview from '../../components/projectOverview/SavedProjectsOverview';
import {
  fetchAvailableProjects,
  clearErrorMessage,
} from '../../redux/actions/backendCommunicationActions';
import {
  ErrorSnackbar,
  DeveloperMenu,
  MainPageMenu,
  LoadExternalSaved,
} from '../../components';
import {
  getServerCommunicationError,
  getProjectsFetched,
  getAvailableProjects,
  getNotSaved,
} from '../../redux/selectors';
import { resetState } from '../../redux/actions/pageActions';

const useStyles = makeStyles((theme) => ({
  background: {
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
  },
  selectionPaper: {
    width: '60%',
    textAlign: 'center',
    margin: '2rem',
    padding: 20,
  },
  projectsList: {
    width: '60%',
    margin: '0 auto',
  },
  projectsListItems: {
    textAlign: 'center',
  },
  addProjectButton: {
    width: '2rem',
    height: '2rem',
    transform: 'scale(1.5)',
  },
  heading: {
    marginBottom: '2rem',
    fontWeight: 'bolder',
  },
  spaceHeading: {
    marginBottom: '1rem',
    fontWeight: 'bolder',
    paddingTop: '2rem',
  },
  scrollArea: {
    maxHeight: 'calc(100% - 70px)',
    height: 'calc(100% - 70px)',
    overflow: 'auto',
  },
}));

interface MainPageProps {
  fetchedAvailableProjects: boolean;
  fetchTheAvailableProjects: () => void;
  loadAutoSave: () => void;
  fetchAvailableProjectsError: ErrorMessageI | undefined;
  clearErrorMessage: () => void;
  resetProjectState: () => void;
  unsavedDataInAutosave: boolean;
}

function MainPage(props: MainPageProps) {
  const classes = useStyles();
  const { t } = useTranslation('mainPage');

  const [tryToFetch, setTryToFetch] = React.useState(true);
  const [developerMenuOpen, setDeveloperMenuOpen] = React.useState(false);
  const [loadAutosaveInfoOpen, setLoadAutosaveInfoOpen] = React.useState(
    props.unsavedDataInAutosave
  );
  const [warningOpen, setWarningOpen] = React.useState(false);

  const {
    resetProjectState,
    fetchTheAvailableProjects,
    fetchedAvailableProjects,
    fetchAvailableProjectsError,
  } = props;

  useEffect(() => {
    if (tryToFetch && !fetchedAvailableProjects) {
      fetchTheAvailableProjects();
      setTryToFetch(false);
      setTimeout(() => setTryToFetch(true), 2000);
    }
  }, [fetchedAvailableProjects, fetchTheAvailableProjects, tryToFetch]);

  useEffect(() => {
    resetProjectState();
  }, [resetProjectState]);

  useEffect(() => {
    if (fetchAvailableProjectsError) {
      setLoadAutosaveInfoOpen(false);
      setWarningOpen(true);
    }
  }, [fetchAvailableProjectsError]);

  return (
    <Paper className={classes.background} square>
      <MainPageMenu />
      <div className={classes.scrollArea}>
        <Grid
          container
          alignItems="center"
          justify="space-around"
          direction="column"
          alignContent="space-around"
        >
          <Paper className={classes.selectionPaper}>
            <Typography id="projectHeading" className={classes.heading} variant="h4">
              {t('loadProjectHeading')}
            </Typography>
            <LoadExternalSaved />
            <Typography className={classes.spaceHeading} variant="h5">
              {t('projectHeading')}
            </Typography>
            <SavedProjectsOverview />
          </Paper>
          <Paper className={classes.selectionPaper}>
            <Typography className={classes.heading} variant="h4">
              {t('useCaseHeading')}
            </Typography>
            <Button
              onClick={() => setDeveloperMenuOpen(true)}
              variant="outlined"
              color="primary"
            >
              {t('developerPageCta')}
            </Button>
          </Paper>
        </Grid>
      </div>
      <DeveloperMenu
        open={developerMenuOpen}
        onClose={() => setDeveloperMenuOpen(false)}
      />
      <Snackbar open={loadAutosaveInfoOpen}>
        <MuiAlert
          variant="filled"
          severity="info"
          onClose={() => setLoadAutosaveInfoOpen(false)}
        >
          {t('unsavedDataInfo')}
          <Button
            color="inherit"
            onClick={() => props.loadAutoSave()}
            style={{ marginLeft: 20 }}
            variant="outlined"
          >
            <Link
              style={{ textDecoration: 'none', color: 'inherit' }}
              to="/project"
            >
              {t('restore')}
            </Link>
          </Button>
        </MuiAlert>
      </Snackbar>
      <ErrorSnackbar
        open={warningOpen}
        error={props.fetchAvailableProjectsError}
        onClose={() => {
          props.clearErrorMessage();
          setWarningOpen(false);
        }}
      />
    </Paper>
  );
}

const mapStateToProps = (state: FrontendReduxStateI) => ({
  availableProjects: getAvailableProjects(state),
  fetchedAvailableProjects: getProjectsFetched(state),
  fetchAvailableProjectsError: getServerCommunicationError(state),
  unsavedDataInAutosave: getNotSaved(state),
});

const mapDispatchToProps = {
  fetchTheAvailableProjects: fetchAvailableProjects,
  loadAutoSave,
  clearErrorMessage,
  resetProjectState: resetState,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
