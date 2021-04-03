import {NodePath, types as t} from "@babel/core";

declare interface ElementUtil {
  name: () => string | null
  attributes: () => NodePath<t.JSXAttribute | t.JSXSpreadAttribute>[] | null
  findAttrPath: (attrName: string) => NodePath | null
  nextSibling: () => NodePath | null
  mergeProps: (
    option: {
      prop: string,
      directivePath: NodePath<t.JSXAttribute>,
      find: (
        attrPath: NodePath<t.JSXAttribute | t.JSXSpreadAttribute>,
        setValue: (val: any) => void
      ) => any,
      getResult: (mergeItems: t.Expression[]) => t.Expression,
      noResolve: boolean
    }
  ) => t.Expression | null
}

declare function elemUtil(path: NodePath): ElementUtil;

export = elemUtil;
