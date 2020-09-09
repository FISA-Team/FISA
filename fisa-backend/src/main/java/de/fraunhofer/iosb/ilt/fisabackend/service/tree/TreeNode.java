package de.fraunhofer.iosb.ilt.fisabackend.service.tree;

import java.util.Collection;
import java.util.function.Consumer;

/**
 * A generic interface for tree nodes.
 *
 * @param <T> the type held in the tree.
 * @param <I> the implementation type of this interface.
 */
public interface TreeNode<T, I extends TreeNode<T, I>> {

    /**
     * Gets the content of this node.
     *
     * @return the content of this node.
     */
    T getValue();

    /**
     * Adds a new child to this tree node and returns the tree node representing and containing the child.
     *
     * @param child the child to add.
     * @return the tree node representing the child in the tree.
     */
    I addChild(T child);

    /**
     * Lets a visitor visit this node, parent nodes and child nodes recursively.
     * The visitor will first visit all (indirect) parent nodes, ordered ascending by
     * their distance to this node. This means, that the root node is the last visited.
     * Then, the visitor will visit this node and the child nodes in their order of insertion.
     *
     * @param visitor the visitor to accept.
     * @see #acceptUpwards(Consumer)
     * @see #acceptDownwards(Consumer)
     */
    default void accept(Consumer<I> visitor) {
        // don't visit this twice, so skip it when visiting upwards
        if (getParent() != null) {
            getParent().acceptUpwards(visitor);
        }
        acceptDownwards(visitor);
    }

    /**
     * Lets a visitor visit this node and all child nodes recursively.
     * The children will be visited in the order of their insertion.
     * The visitor works as depth-first-search on the tree.
     *
     * @param visitor the visitor to accept.
     */
    default void acceptDownwards(Consumer<I> visitor) {
        visitor.accept(self());
        getChildren().forEach(i -> i.acceptDownwards(visitor));
    }

    /**
     * Lets a visitor visit this node and all parent nodes recursively.
     * That results in a order of the nearest parent node to the
     * furthest parent node (the root node).
     *
     * @param visitor the visitor to accept.
     */
    default void acceptUpwards(Consumer<I> visitor) {
        visitor.accept(self());
        if (getParent() != null) {
            getParent().acceptUpwards(visitor);
        }
    }

    /**
     * Gets the parent node of this node. If this node is the root node, {@code null} will be returned.
     *
     * @return the parent node or null, if this node is the root node.
     */
    I getParent();

    /**
     * Gets an unmodifiable collection of the children of this node. Therefore,
     * the returned view cannot be used to add nodes to the tree.
     *
     * @return a collection of children of this node.
     * @see #addChild(Object)
     */
    Collection<I> getChildren();

    /**
     * Returns the node itself. This is used for generic purposes.
     *
     * @return this node.
     */
    I self();

    /**
     * Gets the size of the largest subtree that has this node as root node.
     * That means, parent nodes will not be respected in the returned size
     *
     * @return the size of this subtree.
     */
    default int size() {
        int size = 1; // this node
        for (var child : getChildren()) {
            size += child.size();
        }
        return size;
    }
}
