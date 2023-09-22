import {TreeNode} from "./tree-node";

export class Tree {
  constructor(
    public root: TreeNode,
  ) {
  }
  private _firstFocusableNode!: TreeNode;

  public get firstFocusable(): TreeNode | undefined {
    if (!this._firstFocusableNode) {
      const firstFocusableNode = this._getFirstFocusableNode(this.root)
      if (!firstFocusableNode) {
        throw new Error('No focusable first node found')
      }
      this._firstFocusableNode = firstFocusableNode;
    }
    return this._firstFocusableNode
  }

  private _getFirstFocusableNode(node: TreeNode): TreeNode | undefined {
    if (node.data) {
      return node
    }
    return node.children.find(
      (childrenNode) => this._getFirstFocusableNode(childrenNode),
    )
  }
}
