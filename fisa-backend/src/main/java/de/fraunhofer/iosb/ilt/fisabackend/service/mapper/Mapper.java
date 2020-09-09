package de.fraunhofer.iosb.ilt.fisabackend.service.mapper;

import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;

/**
 * A mapper applies a defined action on a {@link FisaTreeNode}.
 * The action is defined by implementations of this interface.
 */
public interface Mapper extends MappingResolver {

    /**
     * Applies an action on the tree node.
     *
     * @param treeNode the node to apply on.
     * @param arguments optional arguments that can be applied.
     */
    void apply(FisaTreeNode treeNode, String... arguments);
}
