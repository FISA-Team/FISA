package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import java.util.List;

public class FisaObjectAttributeDefinition {

    private String name;
    private String infoText;
    private String valueType;
    private String value;
    private boolean isPredefined;
    private List<String> dropDownValues;
    private String mapsTo;
    private String validationRule;
    private boolean isNotReusable;

    /**
     * Default constructor
     */
    public FisaObjectAttributeDefinition() {
    }

    /**
     * Instantiates a FisaObjectAttributeDefinition.
     *
     * @param name Name of the FisaObjectAttributeDefintion
     * @param infoText Informational text to explain the definition
     * @param valueType Type of value this attribute definition expects
     * @param value Value, if attribute definition is pre-defined
     * @param isPredefined Boolean flag, to signal if pre-defined
     * @param dropDownValues List of values, this attribute definition accepts
     * @param mapsTo Corresponding SensorThings-API this attribute definition maps to
     * @param validationRule Regex to validate values
     */
    public FisaObjectAttributeDefinition(
            String name,
            String infoText,
            String valueType,
            String value,
            boolean isPredefined,
            List<String> dropDownValues,
            String mapsTo,
            String validationRule
    ) {
        this.name = name;
        this.infoText = infoText;
        this.valueType = valueType;
        this.value = value;
        this.isPredefined = isPredefined;
        this.dropDownValues = dropDownValues;
        this.mapsTo = mapsTo;
        this.validationRule = validationRule;
    }

    /**
     * @return Name of the AttributeDefinition
     */
    public String getName() {
        return this.name;
    }

    /**
     * @return The info-text for the user
     */
    public String getInfoText() {
        return this.infoText;
    }

    /**
     * @return The ValueType of the AttributeDefinition
     */
    public String getValueType() {
        return this.valueType;
    }

    /**
     * @return The value of the AttributeDefinition (set if the AttributeDefinition is predefined)
     */
    public String getValue() {
        return this.value;
    }

    /**
     * @return Whether the AttributeDefinition is predefined or can be changed by the user
     */
    public boolean getIsPredefined() {
        return this.isPredefined;
    }

    /**
     * @return Possible Values for a DropDownField in the Frontend
     */
    public List<String> getDropDownValues() {
        return this.dropDownValues;
    }

    /**
     * @return Representation of the target in the SensorThings-API
     */
    public String getMapsTo() {
        return this.mapsTo;
    }

    /**
     * @return Regex validation-rule for the user-input
     */
    public String getValidationRule() {
        return this.validationRule;
    }

    /**
     * @return Boolean flag, to signal if attribute can be used multiple times
     */
    public boolean getIsNotReusable() {
        return this.isNotReusable;
    }

    /**
     * Sets the Name.
     *
     * @param name Name of the attribute definition
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Sets the info-text for the user.
     *
     * @param infoText Informational text
     */
    public void setInfoText(String infoText) {
        this.infoText = infoText;
    }

    /**
     * Sets the data-type of the attribute-value.
     *
     * @param valueType Value type
     */
    public void setValueType(String valueType) {
        this.valueType = valueType;
    }

    /**
     * Sets the value of the attribute.
     *
     * @param value Value
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Sets whether the attribute is defined by default or can be accessed by the user.
     *
     * @param isPredefined Boolean flag, to signal the status
     */
    public void setIsPredefined(boolean isPredefined) {
        this.isPredefined = isPredefined;
    }

    /**
     * Sets the possible values for a DropDown.
     *
     * @param dropDownValues List of values
     */
    public void setDropDownValues(List<String> dropDownValues) {
        this.dropDownValues = dropDownValues;
    }

    /**
     * Sets the target of the AttributeDefinition in SensorThings-API.
     *
     * @param mapsTo Corresponding SensorThings-API entity
     */
    public void setMapsTo(String mapsTo) {
        this.mapsTo = mapsTo;
    }

    /**
     * Sets the validation-rule for user-input.
     *
     * @param validationRule Regex to verify values
     */
    public void setValidationRule(String validationRule) {
        this.validationRule = validationRule;
    }

    /**
     * Sets whether objects of this definition can be used multiple times in a project
     *
     * @param isNotReusable New boolean value
     */
    public void setIsNotReusable(boolean isNotReusable) {
        this.isNotReusable = isNotReusable;
    }
}
