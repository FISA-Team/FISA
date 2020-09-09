package de.fraunhofer.iosb.ilt.fisabackend.service.tree;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * An instance of this class represents one node of a {@link FisaTree}.
 */
public class FisaTreeNode implements TreeNode<FisaObject, FisaTreeNode> {
    private final FisaTreeNode parent;
    private final List<FisaTreeNode> children;
    private final FisaObject object;
    private final Map<Class<?>, Object> context;

    /**
     * Creates a new tree node.
     *
     * @param parent the parent node of the current tree.
     * @param object the content of the node.
     */
    protected FisaTreeNode(FisaTreeNode parent, FisaObject object) {
        this.parent = parent;
        this.object = object;
        this.children = new ArrayList<>();
        this.context = new IdentityHashMap<>();
    }

    /**
     * Add a context entry to the context held by this node.
     *
     * @param contextKey   the key of the context entry to add.
     * @param contextValue the value of the context entry to add.
     * @param <T>          the type of the context value.
     */
    public <T> void addContext(Class<? super T> contextKey, T contextValue) {
        this.context.put(contextKey, contextValue);
    }

    /**
     * Get a context value by its key.
     *
     * @param contextKey the key used to access the context entry.
     * @param <T>        the type of the context value.
     * @return the context value associated with the given key.
     */
    @SuppressWarnings("unchecked")
    public <T> T getContext(Class<? super T> contextKey) {
        return (T) this.context.get(contextKey);
    }

    @Override
    public FisaTreeNode addChild(FisaObject childObject) {
        var childNode = new FisaTreeNode(this, childObject);
        this.children.add(childNode);
        return childNode;
    }

    @Override
    public FisaObject getValue() {
        return this.object;
    }

    @Override
    public FisaTreeNode getParent() {
        return this.parent;
    }

    @Override
    public Collection<FisaTreeNode> getChildren() {
        return Collections.unmodifiableCollection(this.children);
    }

    @Override
    public FisaTreeNode self() {
        return this;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FisaTreeNode)) return false;
        FisaTreeNode that = (FisaTreeNode) o;
        return Objects.equals(this.parent, that.parent)
                && this.object.equals(that.object);
    }

    @Override
    public final int hashCode() {
        return Objects.hash(parent, object);
    }
}
