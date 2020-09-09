import { FisaObjectI } from './fisaInterfaces';
import { PointI, PolygonI } from './valueTypes';

export interface ObjectBundleI {
  definitionName: string;
  caption: string;
  definitionInfoText: string | undefined;
  definitionToAdd: boolean;
  objects: ObjectContentI[];
}

export interface ObjectContentI {
  name: string;
  id: number;
  parentId: number | undefined;
  isClonable: boolean;
  isLinkable: boolean;
}

export interface TreeViewInterfaceI {
  id: number;
  parentId: number | undefined;
  nodeId: string;
  name: string;
  children: (TreeViewInterfaceI | undefined)[] | undefined;
  isLinked: boolean;
}

export interface ProjectTreeViewI {
  tree: TreeViewInterfaceI;
  nodeIdList: string[];
}

export interface ProjectPositionI {
  name: string;
  id: number;
}

export interface ObjectWithNameI extends FisaObjectI {
  nameToShow: string;
  selectable: boolean;
  isLinked: boolean;
}

export interface ObjectsCategoryI {
  definitionName: string;
  ogcType: string;
  caption: string;
  objects: ObjectWithNameI[];
  isAddable: boolean;
}

export interface CardPositionI {
  objectId: number;
  name: string;
  position: PointI | PolygonI;
  isPolygon: boolean;
}
