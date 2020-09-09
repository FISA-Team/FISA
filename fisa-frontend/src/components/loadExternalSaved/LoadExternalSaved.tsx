import React, { useEffect } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';

import { FISA_OBJECTS } from '../../variables/variables';
import { loadAutoSave, loadFromPC } from '../../redux/actions';
import { FisaProjectI, ErrorMessageI } from '../../redux/interfaces';
import { Routes } from '../../environment';
import ErrorSnackbar from '../errorMessages/ErrorSnackbar';

interface LoadExternalSavedProps {
  loadAutoSave: () => void;
  loadProjectFromPC: (project: FisaProjectI) => void;
}

function LoadExternalSaved(props: LoadExternalSavedProps) {
  const { t } = useTranslation(['mainPage', 'errorMessages']);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [error, setError] = React.useState<ErrorMessageI | undefined>(
    undefined
  );
  const { getInputProps, open, acceptedFiles } = useDropzone({
    multiple: false,
  });
  const history = useHistory();
  const { loadProjectFromPC } = props;

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const fileName = acceptedFiles[0].name;
      acceptedFiles[0]
        .text()
        .then((data) => loadProjectFromPC(JSON.parse(data)))
        .then(() => history.push(Routes.PROJECT))
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
          setErrorSnackbarOpen(true);
        });
      acceptedFiles.pop();
    }
  }, [acceptedFiles, loadProjectFromPC, history, t]);

  const canLoadFromLocalStore = () => {
    const itemsFromStore = localStorage.getItem(FISA_OBJECTS);
    return (
      itemsFromStore !== undefined &&
      itemsFromStore !== null &&
      itemsFromStore.length > 0
    );
  };
  return (
    <>
      <ButtonGroup
        orientation="vertical"
        color="primary"
        aria-label="vertical outlined primary button group"
      >
        <Button
          disabled={!canLoadFromLocalStore()}
          onClick={() => props.loadAutoSave()}
        >
          <Link
            style={{ textDecoration: 'none', color: 'inherit' }}
            to="/project"
          >
            {t('loadLastProject')}
          </Link>
        </Button>

        <Button onClick={open}>{t('loadFromPC')}</Button>
      </ButtonGroup>

      <input {...getInputProps()} />
      <ErrorSnackbar
        open={errorSnackbarOpen}
        onClose={() => setErrorSnackbarOpen(false)}
        error={error}
      />
    </>
  );
}

const dispatchToProps = {
  loadAutoSave,
  loadProjectFromPC: loadFromPC,
};

export default connect(null, dispatchToProps)(LoadExternalSaved);
