package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

public class FisaObjectTest {
    private static final int EXAMPLE_ID = 2020;
    private static final int EXAMPLE_ID_TWO = 4040;

    private long expectedId;
    private String expectedDefinitionName;
    private List<Long> expectedChildren;
    private List<FisaObjectAttribute> expectedAttributes;

    private FisaObject actual;

    @BeforeEach
    void setUp() {
        this.expectedId = EXAMPLE_ID;
        this.expectedDefinitionName = "Kitchen";
        this.expectedChildren = new ArrayList<>();
        this.expectedAttributes = new ArrayList<>();

        this.actual = new FisaObject(
                this.expectedId,
                this.expectedDefinitionName,
                this.expectedChildren,
                this.expectedAttributes
        );
    }

    @Test
    void getIdTest() {
        assertEquals(this.expectedId, this.actual.getId());
    }

    @Test
    void getDefinitionNameTest() {
        assertEquals(this.expectedDefinitionName, this.actual.getDefinitionName());
    }

    @Test
    void getChildrenTest() {
        assertIterableEquals(this.expectedChildren, this.actual.getChildren());
    }

    @Test
    void getAttributesTest() {
        assertEquals(this.expectedAttributes, this.actual.getAttributes());
    }

    @Test
    void setIdTest() {
        this.expectedId = EXAMPLE_ID_TWO;

        this.actual.setId(this.expectedId);

        assertEquals(this.expectedId, this.actual.getId());
    }

    @Test
    void setDefinitionNameTest() {
        this.expectedDefinitionName = "Living Room";

        this.actual.setDefinitionName(this.expectedDefinitionName);

        assertEquals(this.expectedDefinitionName, this.actual.getDefinitionName());
    }

    @Test
    void setChildrenTest() {
        Long entry = 2L;

        this.expectedChildren.add(entry);
        this.actual.setChildren(this.expectedChildren);

        assertIterableEquals(this.expectedChildren, this.actual.getChildren());
    }

    @Test
    void setAttributesTest() {
        FisaObjectAttribute entry = new FisaObjectAttribute("Name", "Kitchen 12");

        this.expectedAttributes.add(entry);
        this.actual.setAttributes(this.expectedAttributes);

        assertIterableEquals(this.expectedAttributes, this.actual.getAttributes());
    }
}
