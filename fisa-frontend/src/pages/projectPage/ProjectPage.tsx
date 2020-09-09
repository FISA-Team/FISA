import React from 'react';
import { Paper, Grid } from '@material-ui/core';

// Custom Components
import { makeStyles } from '@material-ui/core/styles';
import {
  CategoricalOverview,
  ProjectTree,
  PositionBar,
  WorkingBox,
  ProjectPageMenu,
} from '../../components';

const useStyles = makeStyles((theme) => ({
  '@global': {
    'html, body, #root': {
      height: '100vh',
    },
  },
  background: {
    height: '100%',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
  },
  secondLine: {
    height: '100%',
  },
}));

function ProjectPage() {
  const classes = useStyles();

  return (
    <Paper className={classes.background} style={{ height: '100%' }} square>
      <ProjectPageMenu />
      <Grid
        container
        spacing={2}
        style={{
          height: '100%',
          maxHeight: '100%',
          padding: '10px',
        }}
        justify="center"
      >
        <Grid item xs={3} md={3} lg={2} className={classes.secondLine}>
          <ProjectTree key="projectTree" />
        </Grid>
        <Grid item xs={6} md={6} lg={8} className={classes.secondLine}>
          <Grid
            container
            spacing={2}
            style={{
              height: '100%',
              maxHeight: '100%',
              padding: '10px',
            }}
            justify="center"
          >
            <Grid item xs={12}>
              <PositionBar key="positionBar" />
            </Grid>
            <Grid item xs={12} className={classes.secondLine}>
              <WorkingBox key="workingBox" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} md={3} lg={2} className={classes.secondLine}>
          <CategoricalOverview key="toolBar" />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProjectPage;
