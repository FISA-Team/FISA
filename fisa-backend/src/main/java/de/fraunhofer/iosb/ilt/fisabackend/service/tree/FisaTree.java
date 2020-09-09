package de.fraunhofer.iosb.ilt.fisabackend.service.tree;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;

/**
 * Represents a tree of {@link FisaObject}s. A the same time, this is the root node
 * of the tree as it's guaranteed to not have a parent.
 *
 * @see FisaTreeNode
 */
public final class FisaTree extends FisaTreeNode {

    /**
     * Creates a new root node.
     *
     * @param object the content of the root node.
     */
    private FisaTree(FisaObject object) {
        super(null, object);
    }

    /**
     * Creates a new root node.
     *
     * @param root the content of the root node.
     * @return the root node of the tree.
     */
    public static FisaTree createTree(FisaObject root) {
        return new FisaTree(root);
    }
}
