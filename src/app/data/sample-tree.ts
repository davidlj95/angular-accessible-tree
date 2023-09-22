import {TreeNode} from "../tree-node/tree-node";
import {TreeNodeData} from "../tree-node/tree-node-data";

export const SAMPLE_TREE =
  TreeNode.text('Root', [
    TreeNode.text('Child 1', [
      TreeNode.text('Child 1.1'),
      TreeNode.text('Child 1.2'),
      TreeNode.text('Child 1.3'),
    ]),
    TreeNode.text('Child 2', [
      TreeNode.text('Child 2.1'),
      TreeNode.text('Child 2.2', [
        TreeNode.text('Child 2.2.1'),
        TreeNode.text('Child 2.2.2'),
        TreeNode.text('Child 2.2.3'),
      ]),
      TreeNode.text('Child 2.3'),
    ]),
    TreeNode.text('Child 3', [
      TreeNode.text('Child 3.1'),
      TreeNode.text('Child 3.2'),
      TreeNode.text('Child 3.3'),
    ]),
    TreeNode.text('Child 4'),
  ])
