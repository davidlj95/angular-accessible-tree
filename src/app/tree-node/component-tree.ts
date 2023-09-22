import {ComponentTreeNode} from "./component-tree-node";
import {TreeNodeComponent} from "./tree-node.component";

export class ComponentTree {
  constructor(
    public root: ComponentTreeNode,
  ) {
  }
  private _firstFocusable!: TreeNodeComponent;

  public get firstFocusable(): TreeNodeComponent | undefined {
    if (!this._firstFocusable) {
      const firstFocusable = this._getFirstFocusableComponent(this.root)
      if (!firstFocusable) {
        throw new Error('No focusable first component found')
      }
      this._firstFocusable = firstFocusable
    }
    return this._firstFocusable
  }

  private _getFirstFocusableComponent(node: ComponentTreeNode): TreeNodeComponent | undefined {
    const firstFocusableDataNode = this.root.modelNode.tree.firstFocusable
    if(node.modelNode === firstFocusableDataNode) {
      return node.component
    }
    return node.children
      .find((child) => child.modelNode == firstFocusableDataNode)
      ?.component
  }

  public get lastFocusable(): TreeNodeComponent | undefined {
    return this.root.lastFocusableChild(this.root)?.component
  }
}
