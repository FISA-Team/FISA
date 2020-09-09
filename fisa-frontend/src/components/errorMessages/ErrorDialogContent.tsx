import React from 'react';
import {
  DialogTitle,
  DialogContent,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';

import { ErrorMessageI } from '../../redux/interfaces';

interface ErrorDialogProps {
  error: ErrorMessageI | undefined;
}

const styles = makeStyles(() => ({
  preStyles: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  dialog: {
    paddingBottom: 100,
  },
}));

export default function ErrorDialogContent(props: ErrorDialogProps) {
  const { t } = useTranslation('errorMessages');
  const classes = styles();
  return (
    <>
      <DialogTitle>
        {props.error?.name}: {props.error?.message}
      </DialogTitle>

      <DialogContent>
        {props.error?.longMessage && (
          <pre className={classes.preStyles}>{props.error.longMessage}</pre>
        )}
        {props.error?.rawMessage && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {t('fullResponse')}
            </AccordionSummary>
            <AccordionDetails>
              <pre className={classes.preStyles}>{props.error.rawMessage}</pre>
            </AccordionDetails>
          </Accordion>
        )}
      </DialogContent>
    </>
  );
}
