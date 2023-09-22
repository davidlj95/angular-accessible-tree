# Angular accessible tree
Implements a [tree view pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) using
[Accessible Rich Internet Applications (ARIA)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) and following the [ARIA Authoring Practices Guide (APG)][aria-apg]. 

Nodes can't be selected. Mainly adds keyboard interactions and focus management.

*Almost* conforming to the [WAI-ARIA 1.2 specifications][aria-1.2-specs] for [trees][tree-spec]. See [conformance note](#conformance-note) for more information.

[aria-1.2-specs]: https://www.w3.org/TR/wai-aria-1.2
[aria-apg]: https://www.w3.org/WAI/ARIA/apg/
[tree-spec]: https://www.w3.org/TR/wai-aria-1.2/#tree

## Implemented interactions
[Everything non-selectable except type-ahead from the authoring guides](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction) (mostly from [first example](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1a/)):
- Focus is:
  - On first visible tree node by default
  - On last tree node explored after tree has been interacted with
- <kbd>Home</kbd>: Moves focus to first node without opening or closing a node.
- <kbd>End</kbd>: Moves focus to the last node that can be focused without expanding any nodes that are closed.
- <kbd>Arrow down</kbd>: Moves focus to the next node that is focusable without opening or closing a node. If focus is on the last node, does nothing.
- <kbd>Arrow up</kbd>: Moves focus to the previous node that is focusable without opening or closing a node. If focus is on the first node, does nothing.
- <kbd>Right arrow</kbd>: When focus is on a closed node, opens the node; focus does not move. When focus is on a open node, moves focus to the first child node. When focus is on an end node, does nothing.
- <kbd>Left arrow</kbd>: When focus is on an open node, closes the node.
  When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node. When focus is on a root node that is also either an end node or a closed node, does nothing.
- <kbd>Home</kbd>: Moves focus to first node without opening or closing a node.
- <kbd>End</kbd>: Moves focus to the last node that can be focused without expanding any nodes that are closed.
- <kbd>*</kbd>: Expands all closed sibling nodes that are at the same level as the focused node. Focus does not move.

Plus a small quick win:
- <kbd>Shift + *</kbd>: Collapses all open sibling nodes that are at the same level as the focused node. Focus does not move.

## Conformance note
ARIA tree roles are designed to select an option inside a tree. [Spec says][tree-spec] a widget with a `tree` role is

> A widget that allows the user to select one or more items from a hierarchically organized collection.

**This implementation is missing feature to select something inside the tree**. There's no clear way on how to implement a non-selectable tree (keep reading chapter below). Probably, [disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) is the way to go in that scenario though. I switched to that for [my website](https://github.com/davidlj95/website)

### ARIA tree role doesn't support non-selectable tree nodes
There's an issue with trees in ARIA. Seems there's no agreement between ARIA practices and specifications on how to implement a non-selectable tree node.

If you check the [ARIA Authoring Practices Guide (APG)][aria-apg], seems that "Tree View" is the proper role for a hierarchical list:

> *"A tree view widget presents a hierarchical list"* [(source)][aria-apg-tree-view]

[aria-apg-tree-view]: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

In the page regarding tree views, it is also added they can be expanded and collapsed:

> *"Any item in the hierarchy may have child items, and items that have children may be expanded or collapsed to show or hide the children"* [(source)][aria-apg-tree-view]
 
Later, it also points out what to do when nodes in the tree aren't selectable:

> *"If the tree contains nodes that are not selectable, neither `aria-selected` nor `aria-checked` is present on those nodes"* [(source)](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#:~:text=nodes%20that%20are%20not%20selectable)

Seems that's it, right? Started coding, until a wild linter warning appeared: `aria-selected` must be present in a tree item (`<li role="treeitem">`). But I don't want to make that tree node selectable 🤔 And the authoring practices guide says it's ok. Then why is that being raised? [Going](https://github.com/angular-eslint/angular-eslint/blob/v16.2.0/packages/eslint-plugin-template/src/rules/valid-aria.ts#L52) [down](https://github.com/angular-eslint/angular-eslint/blob/v16.2.0/packages/eslint-plugin-template/src/rules/valid-aria.ts#L12C11-L12C11) [the hole](https://github.com/A11yance/aria-query), found that

**ARIA 1.2 specs actually don't allow a tree item to not have the `aria-selected` attribute**. Because `aria-selected` attribute [must be present on every tree node according to specs of a tree item][tree-item-spec]. Given it inherits from the `option` role

[option-spec]: https://www.w3.org/TR/wai-aria-1.2/#option
[tree-item-spec]: https://www.w3.org/TR/wai-aria-1.2/#treeitem

So seems there's a discrepancy about that between the [ARIA Authoring Practices Guide (APG)][aria-apg] and the [ARIA-WAI 1.2 specs][aria-1.2-specs]. Indeed, [someone already reported that](https://github.com/w3c/aria-practices/issues/667) to the ARIA APG repo.

In summary, to be specs compliant, `aria-selected` should be there for every tree item (node). Despite with a `false` value as there's nothing to select. But if we do so, we tell a node can be selected, whilst we can't select anything here. 

Sooo

**TL;DR: there's no spec compliant way to implement a tree with non-selectable nodes**

I eventually used [the disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) for a non-selectable hierarchical list instead. Specifically, in my [website](https://github.com/davidlj95/website). But if you want a tree with some selectable and some non-selectable nodes, you'll have to be a bit [evil 😈](https://en.wikipedia.org/wiki/Don%27t_be_evil) and be non-spec compliant.

#### More inconsistencies around

In fact, there have also other places where they use tree item role, but no `aria-selected` is there

```html
<li id="apples" class="tree-parent" role="treeitem" tabindex="-1" aria-expanded="false">
```
Source: https://www.w3.org/WAI/GL/wiki/Using_the_WAI-ARIA_aria-expanded_state_to_mark_expandable_and_collapsible_regions

#### Final notes
- [`aria-hidden` is not needed for collapsed items](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden), given `display: none` hides it from accessibility tools already
- For an example of `tabindex` usage in ARIA practices [tree view example](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1a/) check the [JS code](https://www.w3.org/WAI/content-assets/wai-aria-practices/patterns/treeview/examples/js/treeitem.js). It's not in the inline HTML.
  
## Usage
Run the app development server and play with it. There's instructions in the main `app` component about what's implemented and what not.

## About

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## TODO
- [ ] Add tests (got too excited with recursion and didn't TDD)
