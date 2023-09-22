import {TreeNodeData} from "./tree-node-data";
import {Tree} from "./tree";

export class TreeNode {
  public readonly data?: TreeNodeData
  public readonly children: ReadonlyArray<TreeNode>
  public readonly parent: TreeNode | null
  public readonly tree: Tree

  private constructor(
    data?: TreeNodeData,
    children?: ReadonlyArray<TreeNode>,
    parent?: TreeNode,
  ) {
    this.data = data
    this.parent = parent || null
    this.tree = parent?.tree ?? new Tree(this)
    this.children = (children ?? []).map((children) => new TreeNode(children.data, children.children, this))
  }

  public static new(data?: TreeNodeData, children?: ReadonlyArray<TreeNode>) {
    return new this(data, children, undefined)
  }

  public static text(text: string, children?: ReadonlyArray<TreeNode>) {
    return this.new(new TreeNodeData(text), children)
  }

  public get isLeaf(): boolean {
    return this.children.length == 0
  }

  public get isBranch(): boolean {
    return this.children.length > 0
  }

  public get isFirstFocusable(): boolean {
    return this.tree.firstFocusable === this
  }
}

