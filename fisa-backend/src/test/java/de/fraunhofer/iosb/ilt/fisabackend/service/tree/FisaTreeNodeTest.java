package de.fraunhofer.iosb.ilt.fisabackend.service.tree;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class FisaTreeNodeTest {

    private FisaTreeNode tree;
    private FisaObject rootObject;

    @BeforeEach
    void setUp() {
        this.rootObject = mock(FisaObject.class, "root");
        this.tree = FisaTree.createTree(rootObject);
    }

    @Test
    void sizeRootOnly() {
        assertEquals(1, this.tree.size());
    }

    @Test
    void sizeNested() {
        mockChildren(2, this.tree, child -> mockChildren(2, child, c -> {}));
        assertEquals(7, this.tree.size());
    }

    @Test
    void acceptFromRoot() {
        List<FisaTreeNode> added = new ArrayList<>();
        added.add(this.tree);
        List<FisaTreeNode> visited = new ArrayList<>();
        mockChildren(2, this.tree, child -> {
            added.add(child);
            mockChildren(2, child, added::add);
        });
        this.tree.accept(visited::add);
        assertIterableEquals(added, visited);
    }

    @Test
    void acceptFromInner() {
        FisaObject obj1 = mock(FisaObject.class, "inner1");
        FisaObject obj2 = mock(FisaObject.class, "inner2");
        FisaTreeNode branch = this.tree.addChild(obj1);
        FisaTreeNode inner = branch.addChild(obj2);
        List<FisaTreeNode> added = new ArrayList<>();
        List<FisaTreeNode> visited = new ArrayList<>();
        // start upper
        added.add(branch);
        added.add(this.tree);
        // start lower
        added.add(inner);
        mockChildren(2, inner, child -> {
            added.add(child);
            mockChildren(2, child, added::add);
        });
        inner.accept(visited::add);
        assertIterableEquals(added, visited);
    }

    @Test
    void acceptDownwards() {
    }

    @Test
    void acceptUpwards() {
    }

    @Test
    void addChild() {
        assertEquals(1, this.tree.size());
        assertIterableEquals(Collections.emptyList(), this.tree.getChildren());
        FisaObject child = mock(FisaObject.class);
        FisaTreeNode fisaTreeNode = this.tree.addChild(child);
        assertNotNull(fisaTreeNode);
        assertEquals(2, this.tree.size());
        assertIterableEquals(Collections.singleton(fisaTreeNode), this.tree.getChildren());
    }

    @Test
    void getValue() {
        assertSame(this.rootObject, this.tree.getValue());
    }

    @Test
    void getParent() {
    }

    @Test
    void getChildren() {
        assertEquals(0, this.tree.getChildren().size());
    }

    @Test
    void self() {
        assertSame(this.tree, this.tree.self());
    }

    private void mockChildren(int amount, FisaTreeNode parent, Consumer<FisaTreeNode> createdChildConsumer) {
        for (int i = 0; i < amount; i++) {
            FisaObject mock = mock(FisaObject.class);
            createdChildConsumer.accept(parent.addChild(mock));
        }
    }
}