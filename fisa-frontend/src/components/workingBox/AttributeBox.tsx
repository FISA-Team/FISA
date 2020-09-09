import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  TextField,
  Tooltip,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import { getAttribute } from '../../redux/selectors';
import { changeObjectProperty } from '../../redux/actions/projectActions';
import {
  STRING,
  NUMBER,
  BOOLEAN,
  DROPDOWN,
  EXAMPLE_DROPDOWN,
  POLY_POSITION,
} from '../../variables/valueTypes';
import {
  ActionI,
  AttributeI,
  FrontendReduxStateI,
} from '../../redux/interfaces';
import PolygonPositionAttribute from './PolygonPositionAttribute';

interface DirectAttributeProps {
  attribute: AttributeI;
  dispatch: Dispatch<ActionI>;
  objectId: number;
  disabled: boolean;
}

const style = makeStyles((theme) => ({
  dropdown: {
    minWidth: '100%',
    maxWidth: '100%',
  },
}));

export interface AttributeProps {
  objectId: number;
  attributeDefinitionName: string;
  changeObjectProperty: (key: string, value: string) => void;
  disabled: boolean;
}

function AttributeBox(props: DirectAttributeProps) {
  let attribute;
  const classes = style();

  const { t } = useTranslation('projectPage');

  const [wrongInput, setWrongInput] = React.useState(false);

  const changeObjectEvent = (
    value: number | boolean | string,
    badInput: boolean
  ) => {
    if (badInput) {
      return;
    }

    props.dispatch(
      changeObjectProperty(
        props.objectId,
        props.attribute.definitionName,
        value
      )
    );
  };

  const validate = (value: number | boolean | string) => {
    if (props.attribute.validationRule !== undefined) {
      const strValue: string = value as string;
      const regex = new RegExp(props.attribute.validationRule, 'g');

      setWrongInput(regex.test(strValue));
    }
  };

  switch (props.attribute.valueType) {
    case STRING:
      attribute = (
        <TextField
          disabled={props.disabled}
          error={wrongInput}
          className={classes.dropdown}
          id="standard-basic"
          label={props.attribute.definitionName}
          defaultValue={props.attribute.value}
          onChange={(e) => validate(e.target.value)}
          onBlur={(e) =>
            changeObjectEvent(e.target.value, e.target.validity.badInput)}
        />
      );
      break;
    case NUMBER:
      attribute = (
        <TextField
          disabled={props.disabled}
          className={classes.dropdown}
          id="standard-basic"
          type="number"
          label={props.attribute.definitionName}
          defaultValue={props.attribute.value}
          value={props.attribute.value}
          onChange={(e) =>
            changeObjectEvent(e.target.value, e.target.validity.badInput)}
        />
      );
      break;
    case BOOLEAN:
      attribute = (
        <FormControlLabel
          disabled={props.disabled}
          control={
            <Checkbox
              checked={props.attribute.value as boolean}
              onChange={(e) =>
                changeObjectEvent(e.target.checked, e.target.validity.badInput)}
              name={props.attribute.definitionName}
              color="primary"
            />
          }
          label={props.attribute.definitionName}
        />
      );
      break;
    case DROPDOWN:
      attribute = (
        <FormControl disabled={props.disabled} className={classes.dropdown}>
          <InputLabel>{props.attribute.definitionName}</InputLabel>
          <Select
            value={props.attribute.value}
            onChange={(e) => changeObjectEvent(e.target.value as string, false)}
          >
            {props.attribute.dropDownValues !== undefined &&
              props.attribute.dropDownValues.map((dropdownObject) => (
                <MenuItem value={dropdownObject} key={dropdownObject}>
                  {dropdownObject}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      );
      break;
    case EXAMPLE_DROPDOWN:
      attribute = (
        <AutocompleteValue
          {...props}
          onChange={(value) => changeObjectEvent(value, false)}
        />
      );
      break;
    case POLY_POSITION:
      return (
        <div>
          <PolygonPositionAttribute
            attribute={props.attribute}
            disabled={props.disabled}
            objectId={props.objectId}
          />
        </div>
      );
    default:
      attribute = <Typography>{props.attribute.definitionName}</Typography>;
  }

  return (
    <Tooltip
      placement="left"
      title={
        <>
          {wrongInput && (
            <>
              <Typography variant="body1" color="error">
                {t('contendDowntMatch')}
              </Typography>
              <Typography variant="body1" color="error">
                {props.attribute.validationRule}
              </Typography>
            </>
          )}

          {props.attribute.infoText && (
            <Typography variant="subtitle1">
              {props.attribute.infoText}
            </Typography>
          )}
          <Typography variant="caption">
            maps-to: {props.attribute.ogcType}
          </Typography>
        </>
      }
    >
      {attribute}
    </Tooltip>
  );
}

interface AutocompleteValueProps extends DirectAttributeProps {
  onChange: (value: string) => void;
}

function AutocompleteValue(props: AutocompleteValueProps) {
  return (
    <Autocomplete
      style={{ width: '100%' }}
      inputValue={props.attribute.value as string}
      value={props.attribute.value as string}
      onInputChange={(e, newVal) => {
        props.onChange(newVal);
      }}
      options={props.attribute.dropDownValues as string[]}
      getOptionLabel={(option) => option}
      id="autocomplete"
      renderInput={(params) => (
        <TextField {...params} label={props.attribute.definitionName} />
      )}
      autoSelect
      disableClearable
    />
  );
}

const stateToProps = (state: FrontendReduxStateI, props: AttributeProps) => ({
  attribute: getAttribute(state, props.objectId, props.attributeDefinitionName),
  objectId: props.objectId,
});

export default connect(stateToProps)(AttributeBox);
