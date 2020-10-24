import { Dispatch, RefObject } from 'react';

import {
  ObjectWithNameI,
  ObjectsCategoryI,
  ActionI,
  PointI,
} from '../../redux/interfaces';

export interface AttributeProps {
  objectId: number;
  attributeDefinitionName: string;
  // eslint-disable-next-line
  changeObjectProperty: (key: string, value: string) => void;
  disabled: boolean;
}

export interface ObjectBoxBaseProps {
  object: ObjectWithNameI;
  removeObject: (objectId: number, removeFromFrost: boolean) => void;
  changeObjectProperty: (objectId: number, key: string, value: string) => void;
  goToObject: (objectId: number) => void;
}

export interface ObjectBoxProps extends ObjectBoxBaseProps {
  dispatch: Dispatch<ActionI>;
  positionData: PointI;
  dontShowWarning: boolean;
  highlightedObject: number;
}

export interface ObjectBoxCategoryProps {
  dispatch: Dispatch<ActionI>;
  objectCategory: ObjectsCategoryI;
  scroll: (options?: ScrollOptions) => void;
}

export interface WorkingBoxProps {
  scroll: (options?: ScrollOptions) => void;
  dispatch: Dispatch<ActionI>;
  objectCategories: ObjectsCategoryI[];
  highlightedObject: number;
}

interface ScrollOptions {
  id?: string;
  ref?: React.RefObject<unknown>;
  x?: number;
  y?: number;
  smooth?: boolean;
}

export interface ObjectGridProps {
  dispatch: Dispatch<ActionI>;
  objects: ObjectWithNameI[];
  definitionName: string;
  withAddIcon: boolean;
  scroll: (options?: ScrollOptions) => void;
  parentRef: RefObject<HTMLDivElement>;
}

export interface ObjectBoxFrameProps {
  scroll: (options?: ScrollOptions) => void;
  dispatch: Dispatch<ActionI>;
  object: ObjectWithNameI;
  highlightedObject: number;
  parentRef: RefObject<HTMLDivElement>;
  scrollingActive: boolean;
}
