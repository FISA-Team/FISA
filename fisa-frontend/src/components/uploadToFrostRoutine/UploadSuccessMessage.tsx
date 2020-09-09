/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAlert from '@material-ui/lab/Alert';
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Link,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import { DatastreamData, FrontendReduxStateI } from '../../redux/interfaces';
import { getDatastremConnectionData } from '../../redux/selectors';

const OGCInfoAddress = 'http://developers.sensorup.com/docs/#observations';

const styles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
  },
  copyButton: {
    float: 'right',
  },
  listBox: {
    position: 'relative',
    overflow: 'auto',
    height: 250,
    width: 400,
  },
  projectsListItems: {
    textAlign: 'center',
  },
  topBox: {
    paddingBottom: 20,
  },
}));

interface SuccessProps {
  close: () => void;
  connectionData: DatastreamData[] | undefined;
  frostUrl: string;
}

function Success(props: SuccessProps) {
  const { t } = useTranslation('menus');
  const classes = styles();
  const [copySuccessOpen, setCopySuccessOpen] = React.useState(false);

  return (
    <>
      <DialogTitle>{t('successfullyUploaded')}</DialogTitle>
      <DialogContent style={{ width: '100%', height: '100%' }}>
        <DialogContentText variant="h5">
          {t('availableDatastreams')}
        </DialogContentText>
        {props.connectionData?.map((data, index) => {
          return (
            <Accordion key={data.name}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions2-content"
                id="additional-actions2-header"
              >
                <a
                  className={classes.link}
                  href={`${props.frostUrl}/Datastreams(${data.id})`}
                  target="_blank"
                  rel="noopener"
                >
                  <Link variant="h6">
                    {index + 1}) "{data.name}" {t('accessWith')}{' '}
                    {`{ @iot.id: ${data.id} }`}
                  </Link>
                </a>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        createCurlCommand(data.id, props.frostUrl)
                      );
                      setCopySuccessOpen(true);
                    }}
                    color="primary"
                  >
                    {t('copy')}
                  </Button>
                  <Typography>{t('curlExample')}</Typography>

                  <pre>{createCurlCommand(data.id, props.frostUrl)}</pre>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <DialogContentText variant="subtitle1">
          {t('moreObservationInfo')}
          <br />

          <a href={OGCInfoAddress} target="_blank" rel="noopener">
            <Link>{OGCInfoAddress}</Link>
          </a>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.close}>{t('close')}</Button>
      </DialogActions>
      <Snackbar
        open={copySuccessOpen}
        autoHideDuration={2000}
        onClose={() => setCopySuccessOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setCopySuccessOpen(false)}
          severity="success"
        >
          {t('copiedMsg')}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

function createCurlCommand(datastreamId: string | number, frostUrl: string) {
  const data = JSON.stringify(
    {
      phenomenonTime: '2017-02-07T18:02:00.000Z',
      resultTime: '2017-02-07T18:02:00.000Z',
      result: 21.6,
      Datastream: { '@iot.id': datastreamId },
    },
    null,
    2
  );
  return `curl -X POST -H "Content-Type: application/json" -d '${data}' "${frostUrl}/Observations"`;
}

const successStateToProps = (state: FrontendReduxStateI) => ({
  connectionData: getDatastremConnectionData(state),
});

export default connect(successStateToProps)(Success);
