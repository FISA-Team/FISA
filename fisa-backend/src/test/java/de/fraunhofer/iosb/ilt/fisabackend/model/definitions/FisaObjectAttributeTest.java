package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FisaObjectAttributeTest {

    private String expectedDefinitionName;
    private String expectedValue;

    private FisaObjectAttribute actual;

    @BeforeEach
    void setUp() {
        this.expectedDefinitionName = "Name";
        this.expectedValue = "Kitchen 1";

        this.actual = new FisaObjectAttribute(this.expectedDefinitionName, this.expectedValue);
    }

    @Test
    void getDefinitionNameTest() {
        assertEquals(this.expectedDefinitionName, this.actual.getDefinitionName());
    }

    @Test
    void getValueTest() {
        assertEquals(this.expectedValue, this.actual.getValue());
    }

    @Test
    void setDefinitionNameTest() {
        String testName = "Location";

        this.expectedDefinitionName = testName;
        this.actual.setDefinitionName(testName);

        assertEquals(this.expectedDefinitionName, this.actual.getDefinitionName());
    }

    @Test
    void setValueTest() {
        String testValue = "Karlsruhe";

        this.expectedDefinitionName = testValue;
        this.actual.setDefinitionName(testValue);

        assertEquals(this.expectedValue, this.actual.getValue());
    }
}
