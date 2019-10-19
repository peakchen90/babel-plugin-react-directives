import {NodePath, Node, types as t} from "@babel/core";

declare interface AttributeUtil {
  name: () => string | null
  valuePath: () => NodePath | null
  valueExpr: () => Node | null
  JSXElement: () => NodePath<t.JSXElement> | null
}

declare function attrUtil(path: NodePath): AttributeUtil;

export = attrUtil;
