import React, { ChangeEvent, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import TreeView from '@material-ui/lab/TreeView';
import { Button, MenuItem, makeStyles, ButtonGroup } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useTranslation } from 'react-i18next';
import CustomTreeItem from './CustomTreeItem';
import {
  FrontendReduxStateI,
  TreeViewInterfaceI,
  ActionI,
  ProjectTreeViewI,
} from '../../redux/interfaces';
import { setObjectActive } from '../../redux/actions';
import { getHighlightedObject, getProjectTree } from '../../redux/selectors';

const scrollAreaHeight = 'calc(100% - 135px)';
const rootHeight = 'calc(100% - 65px)';

const style = makeStyles((theme) => ({
  projectRoot: {
    height: '45px',
    marginBottom: '25px',
    marginTop: '20px',
  },
  scrollArea: {
    height: scrollAreaHeight,
    maxHeight: scrollAreaHeight,
    overflowY: 'auto',
    overflowX: 'auto',
    marginBottom: 10,
  },
  root: {
    height: rootHeight,
    maxHeight: rootHeight,
  },
  centered: {
    textAlign: 'center',
  },
}));

export interface ProjectTreeProps {
  dispatch: Dispatch<ActionI>;
  treeOverview: ProjectTreeViewI;
  highlightedObject: number;
}

function ProjectTree(props: ProjectTreeProps) {
  const classes = style();
  const [expanded, setExpanded] = React.useState(props.treeOverview.nodeIdList);

  const { t } = useTranslation('projectPage');

  const collapseAll = () => setExpanded([]);

  const expandAll = () => setExpanded(props.treeOverview.nodeIdList);

  const handleToggle = (event: ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  useEffect(() => {
    const toExpand = findActive(
      props.treeOverview.tree,
      props.highlightedObject
    );

    // eslint-disable-next-line
    toExpand?.forEach((id) => {
      if (id) {
        if (!expanded.includes(id)) {
          setExpanded((oldExpanded) => [...oldExpanded, id]);
        }
      }
    });
  });

  return (
    <div className={classes.root}>
      <MenuItem
        onClick={() =>
          props.dispatch(setObjectActive(props.treeOverview.tree.id))}
        className={classes.projectRoot}
      >
        <h3>{props.treeOverview.tree.name}</h3>
      </MenuItem>
      <div className={classes.scrollArea}>
        {props.treeOverview.tree.children?.map((child) => {
          if (child === undefined) {
            return {};
          }
          return (
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              expanded={expanded}
              onNodeToggle={handleToggle}
              key={child.id}
              disableSelection={true}
            >
              <CustomTreeItem
                highlightedObject={props.highlightedObject}
                node={child}
                dispatch={props.dispatch}
              />
            </TreeView>
          );
        })}
      </div>
      <div className={classes.centered}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button onClick={() => expandAll()}>{t('expandButton')}</Button>
          <Button onClick={() => collapseAll()}>{t('collapseButton')}</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

function findActive(
  node: TreeViewInterfaceI | undefined,
  highlighted: number
): string[] | undefined {
  if (!node) {
    return undefined;
  }
  if (node.id === highlighted) {
    return [];
  }
  if (!node.children) {
    return undefined;
  }
  const allFound: string[] = [];
  let foundOne = false;

  for (let i = 0; i < node.children.length; i++) {
    const found = findActive(node.children[i], highlighted);
    if (found) {
      foundOne = true;
      found.forEach((nodeId) => {
        if (!allFound.includes(nodeId)) {
          allFound.push(nodeId);
        }
      });
    }
  }
  return foundOne ? [...allFound, node.nodeId] : undefined;
}

const mapStateToProps = (state: FrontendReduxStateI) => ({
  treeOverview: getProjectTree(state),
  highlightedObject: getHighlightedObject(state),
});

export default connect(mapStateToProps)(ProjectTree);
