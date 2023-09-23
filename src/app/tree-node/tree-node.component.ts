import {Component, ElementRef, HostBinding, Input, QueryList, ViewChildren} from '@angular/core';
import {TreeNode} from "./tree-node";
import {ComponentTreeNode} from "./component-tree-node";

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {
  @Input({required: true}) node!: TreeNode;
  @Input() parent: TreeNodeComponent | undefined;
  @ViewChildren("children") children!: QueryList<ElementRef>;

  private DEFAULT_EXPANDED = false;
  private _expanded: boolean = this.DEFAULT_EXPANDED;
  private _focused?: boolean

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  @HostBinding('attr.aria-expanded')
  public get isExpanded(): boolean | undefined {
    if (this.node.isLeaf) {
      return undefined;
    }
    return this._expanded
  }

  public get listRole(): 'tree' | 'group' {
    return this.parent ? 'group' : 'tree'
  }

  public get listItemRole(): 'treeitem' {
    return 'treeitem'
  }

  public get tabIndex(): 0 | -1 {
    if (this._focused === undefined) {
      return this.node.isFirstFocusable ? 0 : -1
    }

    return this._focused ? 0 : -1
  }

  private _componentNode!: ComponentTreeNode;

  protected get componentNode(): ComponentTreeNode {
    if (!this._componentNode) {
      this._componentNode = this._getComponentNode()
    }
    return this._componentNode
  }

  public onClick() {
    this.toggleCollapse()
  }

  public onKeydownArrowRight() {
    if (this.node.isLeaf) {
      return
    }

    if (!this._expanded) {
      this.expand()
      return
    }

    this.moveFocusTo(this.componentNode.nextFocusable())
  }

  public onKeydownArrowLeft() {
    if (this.node.isBranch && this._expanded) {
      this.collapse()
      return
    }

    // TODO: empty root node data case
    if (this.node.parent && (this.node.isLeaf || !this._expanded)) {
      this.moveFocusTo(this.parent)
    }
  }

  public onKeydownArrowDown() {
    this.moveFocusTo(this.componentNode.nextFocusable())
  }

  public onKeydownArrowUp() {
    this.moveFocusTo(this.componentNode.previousFocusable())
  }

  public onKeydownHome() {
    this.moveFocusTo(this.componentNode.tree.firstFocusable)
  }

  public onKeydownEnd() {
    this.moveFocusTo(this.componentNode.tree.lastFocusable)
  }

  public onKeydownAsterisk() {
    if (this.componentNode.parent) {
      this.componentNode.parent.children.forEach((child) => {
        child.component.expand()
      })
    }
  }

  // Extra :P
  public onKeydownShiftAsterisk() {
    if (this.componentNode.parent) {
      this.componentNode.parent.children.forEach((child) => {
        child.component.collapse()
      })
    }
  }

  public focus() {
    this.elementRef.nativeElement.querySelector('.data').focus()
    this._focused = true
  }

  private _getComponentNode(): ComponentTreeNode {
    if (!this.parent) {
      return ComponentTreeNode.fromRootComponent(this)
    }
    const componentNode = this.parent.componentNode.findNodeByComponent(this)
    if (!componentNode) {
      throw new Error("Can't find component node from parent")
    }
    return componentNode
  }

  private unfocus() {
    this._focused = false
  }

  private moveFocusTo(component?: TreeNodeComponent) {
    if (!component) {
      return
    }
    this.unfocus()
    component.focus()
  }


  private toggleCollapse() {
    this._expanded ? this.collapse() : this.expand()
  }

  private expand() {
    if (this.node.isLeaf) {
      return
    }

    this._expanded = true
  }

  private collapse() {
    if (this.node.isLeaf) {
      return
    }

    this._expanded = false
  }
}
