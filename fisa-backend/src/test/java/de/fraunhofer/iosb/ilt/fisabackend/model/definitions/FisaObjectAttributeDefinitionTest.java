package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

public class FisaObjectAttributeDefinitionTest {

    private String expectedName;
    private String expectedInfoText;
    private String expectedValueType;
    private String expectedValue;
    private boolean expectedIsPredefined;
    private List<String> expectedDropDownValues;
    private String expectedMapsTo;
    private String expectedValidationRule;
    private boolean expectedIsNotReusable;

    private FisaObjectAttributeDefinition actual;

    @BeforeEach
    void setUp() {
        this.expectedName = "Location";
        this.expectedInfoText = "Enter the location of your entity";
        this.expectedValueType = "string";
        this.expectedValue = "";
        this.expectedIsPredefined = false;
        this.expectedDropDownValues = null;
        this.expectedMapsTo = "Location";
        this.expectedValidationRule = "^(-?\\d+(\\.\\d+)?),\\s*(-?\\d+(\\.\\d+)?)$";

        this.actual = new FisaObjectAttributeDefinition(
                this.expectedName,
                this.expectedInfoText,
                this.expectedValueType,
                this.expectedValue,
                this.expectedIsPredefined,
                this.expectedDropDownValues,
                this.expectedMapsTo,
                this.expectedValidationRule
        );
    }

    @Test
    void getNameTest() {
        assertEquals(this.expectedName, this.actual.getName());
    }

    @Test
    void getInfoTextTest() {
        assertEquals(this.expectedInfoText, this.actual.getInfoText());
    }

    @Test
    void getValueTypeTest() {
        assertEquals(this.expectedValueType, this.actual.getValueType());
    }

    @Test
    void getValueTest() {
        assertEquals(this.expectedValue, this.actual.getValue());
    }

    @Test
    void getIsPredefinedTest() {
        assertEquals(this.expectedIsPredefined, this.actual.getIsPredefined());
    }

    @Test
    void getDropDownValuesTest() {
        assertIterableEquals(this.expectedDropDownValues, this.actual.getDropDownValues());
    }

    @Test
    void getMapsToTest() {
        assertEquals(this.expectedMapsTo, this.actual.getMapsTo());
    }

    @Test
    void getValidationRuleTest() {
        assertEquals(this.expectedValidationRule, this.actual.getValidationRule());
    }

    @Test
    void getIsNotReusableTest() {
        assertEquals(this.expectedIsNotReusable, this.actual.getIsNotReusable());
    }

    @Test
    void setNameTest() {
        this.expectedName = "Number";

        this.actual.setName(this.expectedName);

        assertEquals(this.expectedName, this.actual.getName());
    }

    @Test
    void setInfoTextTest() {
        this.expectedInfoText = "pick the number of your house";

        this.actual.setInfoText(this.expectedInfoText);

        assertEquals(this.expectedInfoText, this.actual.getInfoText());
    }

    @Test
    void setValueTypeTest() {
        this.expectedValueType = "number";

        this.actual.setValueType(this.expectedValueType);

        assertEquals(this.expectedValueType, this.actual.getValueType());
    }

    @Test
    void setValueTest() {
        this.expectedValue = "2";

        this.actual.setValue(this.expectedValue);

        assertEquals(this.expectedValue, this.actual.getValue());
    }

    @Test
    void setIsPredefinedTest() {
        this.expectedIsPredefined = true;

        this.actual.setIsPredefined(true);

        assertEquals(this.expectedValue, this.actual.getValue());
    }

    @Test
    void setDropDownValuesTest() {
        List<String> testList = new ArrayList<>();

        testList.add("3");
        testList.add("4");

        this.expectedDropDownValues = testList;
        this.actual.setDropDownValues(testList);

        assertIterableEquals(this.expectedDropDownValues, this.actual.getDropDownValues());
    }

    @Test
    void setMapsToTest() {
        this.expectedMapsTo = "STA.Thing.properties[number]";

        this.actual.setMapsTo(this.expectedMapsTo);

        assertEquals(this.expectedMapsTo, this.actual.getMapsTo());
    }

    @Test
    void setValidationRuleTest() {
        this.expectedValidationRule = "^[0-9]*$";

        this.actual.setValidationRule(this.expectedValidationRule);

        assertEquals(this.expectedValidationRule, this.actual.getValidationRule());
    }

    @Test
    void setIsNotReusable() {
        this.expectedIsNotReusable = true;
        this.actual.setIsNotReusable(true);

        assertEquals(this.expectedIsNotReusable, this.actual.getIsNotReusable());
    }
}
