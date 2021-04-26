

export interface TreeNode {
    data?: any;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
}

export interface rowNode {
    level?,
    node?: TreeNode,
    parent?,
    visible?,
}