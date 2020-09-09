import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';
import UseCaseOverview from '../useCasesOverview/useCaseOverview';
import { addDocument, setErrorToShow } from '../../redux/actions';
import { FisaDocumentI, ErrorMessageI } from '../../redux/interfaces';

interface DeveloperMenuProps {
  open: boolean;
  onClose: () => void;
  addNewDocument: (document: FisaDocumentI) => void;
  setError: (error: ErrorMessageI) => void;
}

function DeveloperMenu(props: DeveloperMenuProps) {
  const { getInputProps, open, acceptedFiles } = useDropzone({
    multiple: false,
  });
  const { addNewDocument, setError } = props;
  const { t } = useTranslation(['mainPage', 'errorMessages']);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const fileName = acceptedFiles[0].name;
      acceptedFiles[0]
        .text()
        .then((data) => addNewDocument(JSON.parse(data)))
        .catch((e) => {
          const message =
            e instanceof SyntaxError
              ? t('JSONErrorMessage')
              : t('noValidFisaJson');
          setError({
            name: e.name,
            message: `Can't load ${fileName}`,
            code: 0,
            longMessage: message,
            rawMessage: e.message,
          });
        });
      acceptedFiles.pop();
    }
  }, [acceptedFiles, addNewDocument, t, setError]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('devMenuHeading')}</DialogTitle>
      <DialogContent>
        <UseCaseOverview removable={true} />
      </DialogContent>
      <input {...getInputProps()} />
      <DialogActions>
        <Button onClick={props.onClose}>{t('close')}</Button>
        <Button onClick={() => open()}>{t('uploadUsecase')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(null, {
  addNewDocument: addDocument,
  setError: setErrorToShow,
})(DeveloperMenu);
