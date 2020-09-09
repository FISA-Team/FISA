package de.fraunhofer.iosb.ilt.fisabackend.service.tree;

import java.util.function.Consumer;

/**
 * A functional interface to visit {@link FisaTreeNode}s.
 */
@FunctionalInterface
public interface FisaVisitor extends Consumer<FisaTreeNode> {

    @Override
    default void accept(FisaTreeNode fisaTreeNode) {
        this.visit(fisaTreeNode);
    }

    /**
     * The action to perform on the specified node.
     *
     * @param fisaTreeNode the node to perform an action on.
     */
    void visit(FisaTreeNode fisaTreeNode);
}
