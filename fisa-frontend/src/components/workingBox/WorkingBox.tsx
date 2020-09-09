import React, { ComponentType } from 'react';
import { ScrollToHOC, ScrollArea } from 'react-scroll-to';
import { connect } from 'react-redux';
import ObjectBoxCategory from './ObjectBoxCategory';
import { WorkingBoxProps } from './workingBoxInterfaces';
import { FrontendReduxStateI } from '../../redux/interfaces';
import {
  getHighlightedObject,
  getObjectsInActiveWithCategories,
} from '../../redux/selectors';

/**
 * The Working box where the subObjects of the active Object are displayed
 */
const WorkingBox: ComponentType<WorkingBoxProps> = (props: WorkingBoxProps) => {
  return (
    <ScrollArea
      id="WorkingBoxScrollArea"
      style={{ height: 'calc(100% - 104px)', overflowY: 'auto' }}
    >
      {props.objectCategories.map((objectCategory) => (
        <ObjectBoxCategory
          key={objectCategory.definitionName}
          objectCategory={objectCategory}
          dispatch={props.dispatch}
          scroll={props.scroll}
        />
      ))}
    </ScrollArea>
  );
};

const mapStateToProps = (state: FrontendReduxStateI) => {
  return {
    objectCategories: getObjectsInActiveWithCategories(state),
    highlightedObject: getHighlightedObject(state),
  };
};

export default ScrollToHOC(connect(mapStateToProps)(WorkingBox));
