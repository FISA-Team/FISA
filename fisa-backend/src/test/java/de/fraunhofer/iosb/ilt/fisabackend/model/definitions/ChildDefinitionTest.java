package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ChildDefinitionTest {

    private String expectedObjectName;
    private int expectedQuantity;
    private String expectedInfoText;

    private ChildDefinition actual;

    @BeforeEach
    void setUp() {
        this.expectedObjectName = "Fridge";
        this.expectedQuantity = 2;
        this.expectedInfoText = "Add a fridge to your room";

        this.actual = new ChildDefinition(this.expectedObjectName, this.expectedQuantity, this.expectedInfoText);
    }

    @Test
    void getObjectNameTest() {
        assertEquals(this.expectedObjectName, this.actual.getObjectName());
    }

    @Test
    void getQuantityTest() {
        assertEquals(this.expectedQuantity, this.actual.getQuantity());
    }

    @Test
    void getInfoTextTest() {
        assertEquals(this.expectedInfoText, this.actual.getInfoText());
    }

    @Test
    void setObjectNameTest() {
        this.expectedObjectName = "Temperature sensor";
        this.actual.setObjectName("Temperature sensor");

        assertEquals(this.expectedObjectName, this.actual.getObjectName());
    }

    @Test
    void setQuantityTest() {
        this.expectedQuantity = 10;
        this.actual.setQuantity(10);

        assertEquals(this.expectedQuantity, this.expectedQuantity);
    }

    @Test
    void setInfoTextTest() {
        this.expectedInfoText = "Measures the temperature in your room";
        this.actual.setInfoText("Measures the temperature in your room");

        assertEquals(this.expectedInfoText, this.actual.getInfoText());
    }
}
