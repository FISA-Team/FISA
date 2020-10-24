/* eslint-disable react/jsx-no-target-blank */
import { Link, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { FrontendReduxStateI } from '../../redux/interfaces';
import { getConnectedFrostServer } from '../../redux/selectors';

const styles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
  },
}));

interface FrostLinkProps {
  ogcType: string;
  frostUrl: string | undefined;
  frostId: number | undefined;
}

const FrostLink = (props: FrostLinkProps) => {

  const { t } = useTranslation('projectPage');
  const classes = styles();
  let type: string;

  switch (props.ogcType) {
    case 'FeaturesOfInterest':
      type = 'FeaturesOfInterest';
      break;
    case 'ObservedProperty':
      type = 'ObservedProperties';
      break;
    default:
      if (props.ogcType.endsWith('s')) {
        type = props.ogcType;
      } else {
        type = `${props.ogcType}s`;
      }
  }
  const address = `${props.frostUrl}/${type}(${props.frostId})`;

  return (
    <a
      className={classes.link}
      href={address}
      target="_blank"
      rel="noopener"
    >
      <Link variant="body1">
        {t('goToFrostLocation')}
      </Link>
    </a>
  );
};

const stateToProps = (state: FrontendReduxStateI) => ({
  frostUrl: getConnectedFrostServer(state),
});


export default connect(stateToProps)(FrostLink);