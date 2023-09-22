import {ComponentTree} from "./component-tree";
import {TreeNodeComponent} from "./tree-node.component";
import {TreeNode} from "./tree-node";

export class ComponentTreeNode {
  public readonly children: ReadonlyArray<ComponentTreeNode>
  public readonly parent: ComponentTreeNode | null
  public readonly tree: ComponentTree
  private _index?: number | null

  private constructor(
    public component: TreeNodeComponent,
    children: ReadonlyArray<TreeNodeComponent>,
    parent?: ComponentTreeNode,
  ) {
    this.parent = parent || null
    this.tree = parent?.tree || new ComponentTree(this)
    this.children = children
      .map((component) =>
        new ComponentTreeNode(
          component,
          component.children.toArray() as unknown as ReadonlyArray<TreeNodeComponent>,
          this,
        ),
      )
  }

  public static fromRootComponent(component: TreeNodeComponent) {
    if(component.parent) {
      throw new Error('Just a root component can create a tree node')
    }
    return new ComponentTreeNode(
      component,
      component.children.toArray() as unknown as ReadonlyArray<TreeNodeComponent>,
    )
  }

  public get modelNode(): TreeNode {
    return this.component.node
  }

  public findNodeByComponent(component: TreeNodeComponent): ComponentTreeNode | undefined {
    return this.children.find((node) => node.component === component)
  }

  public nextFocusable(): TreeNodeComponent | undefined {
    if (this.modelNode.isBranch && this.component.isExpanded) {
      return this.children[0].component
    }

    if (this.nextSibling) {
      return this.nextSibling?.component
    }

    return this.nextNode?.component
  }

  private get nextSibling(): ComponentTreeNode | undefined {
    if (this.index === null || this.index === this.parent!.children.length - 1) {
      return
    }

    return this.parent!.children[this.index + 1]
  }

  private get index(): number | null {
    if (this._index === undefined) {
      this._index = this._findIndex()
    }

    return this._index
  }

  private _findIndex(): number | null {
    if (!this.parent) {
      return null
    }

    const index = this.parent.children
      .findIndex((node) => node == this)
    if (index == -1) {
      throw new Error("Can't find self as parent's child")
    }
    return index
  }

  private get nextNode(): ComponentTreeNode | undefined {
    return this.parent?.nextSibling || this.parent?.nextNode
  }

  public previousFocusable(): TreeNodeComponent | undefined {
    if (this.previousSibling?.modelNode.isBranch && this.previousSibling.component.isExpanded) {
      return this.lastFocusableChild(this.previousSibling)?.component
    }

    return this.previousSibling?.component || this.parent?.component
  }

  private get previousSibling(): ComponentTreeNode | undefined {
    if (this.index === null || this.index === 0) {
      return
    }

    return this.parent!.children[this.index - 1]
  }

  public lastFocusableChild(node: ComponentTreeNode): ComponentTreeNode | undefined {
    if (!node.modelNode.isBranch || !node.component.isExpanded) {
      return node
    }
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i]
      const lastChildFocusable = this.lastFocusableChild(child)
      if (lastChildFocusable) {
        return this.lastFocusableChild(child)
      }
    }
    return
  }
}
