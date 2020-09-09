import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';

import OverviewItem from './overvieItem';
import { getAllActiveObjectBundles } from '../../redux/selectors';
import {
  FrontendReduxStateI,
  ObjectContentI,
  ObjectBundleI,
  ActionI,
} from '../../redux/interfaces';

const style = makeStyles((theme) => ({
  root: {
    height: 'calc(100% - 20px)',
    maxHeight: 'calc(100% - 20px)',
  },
  searchBarField: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginTop: 15,
    marginBottom: 20,
  },
  searchBar: {
    width: '100%',
  },
  objectDefinitionArea: {
    height: 'calc(100% - 120px)',
    maxHeight: 'calc(100% - 120px)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
}));

/**
 * This Component represents the ObjectToolbar. It contains the different Objects witch can be added to the WorkingBox
 */

export interface CategoricalOverviewProps {
  dispatch: Dispatch<ActionI>;
  objectBundles: ObjectBundleI[];
}

const CategoricalOverview = (props: CategoricalOverviewProps) => {
  const classes = style();
  const { t } = useTranslation('projectPage');
  const [searchText, setSearchText] = React.useState('');

  const [expendedName, setExpendedName] = React.useState('');

  return (
    <div className={classes.root}>
      <div className={classes.searchBarField}>
        <TextField
          className={classes.searchBar}
          onChange={(event) => setSearchText(event.target.value)}
          value={searchText}
          id="objectSearchBar"
          label={t('searchLabel')}
          variant="outlined"
        />
      </div>
      <div className={classes.objectDefinitionArea}>
        {filterObjectDefinitions(props.objectBundles, searchText).map(
          (objectBundle) => {
            return (
              <OverviewItem
                justOpened={searchText !== ''}
                objectBundle={objectBundle}
                key={objectBundle.definitionName}
                expendedName={expendedName}
                setExpendedName={setExpendedName}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

function filterObjectDefinitions(
  objectBundlers: ObjectBundleI[],
  searchText: string
): ObjectBundleI[] {
  if (searchText === '') {
    return objectBundlers;
  }

  const newObjectBundler: ObjectBundleI[] = [];
  objectBundlers.forEach((bundler) => {
    const objectsOfBundler: ObjectContentI[] = [];
    bundler.objects.forEach((object) => {
      if (object.name.toLowerCase().includes(searchText.toLowerCase())) {
        objectsOfBundler.push(object);
      }
    });
    if (
      objectsOfBundler.length > 0 ||
      bundler.definitionName.toLowerCase().includes(searchText.toLowerCase())
    ) {
      newObjectBundler.push({
        ...bundler,
        objects: objectsOfBundler,
      });
    }
  });
  return newObjectBundler;
}

const mapStateToProps = (state: FrontendReduxStateI) => ({
  objectBundles: getAllActiveObjectBundles(state),
});

export default connect(mapStateToProps)(CategoricalOverview);
