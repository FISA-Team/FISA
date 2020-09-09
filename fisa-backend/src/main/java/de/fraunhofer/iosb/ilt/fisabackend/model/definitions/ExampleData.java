package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.time.LocalDateTime;

/**
 * ExampleData contains data to generate numeric sensor data for illustration purposes.
 */
public class ExampleData {

    private int count;
    private double valueMax;
    private double valueMin;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime timeMin;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime timeMax;

    /**
     * Default constructor
     */
    public ExampleData() {
    }

    /**
     * Instantiates ExampleData
     *
     * @param count Quantity of required data entries
     * @param valueMax Maximum value
     * @param valueMin Minimum value
     * @param timeMax Ending point of generation
     * @param timeMin Beginning point of generation
     */
    public ExampleData(int count, double valueMax, double valueMin, LocalDateTime timeMax, LocalDateTime timeMin) {
        this.count = count;
        this.valueMax = valueMax;
        this.valueMin = valueMin;
        this.timeMax = timeMax;
        this.timeMin = timeMin;
    }

    /**
     * @return The count of data-points that should be generated
     */
    public int getCount() {
        return this.count;
    }

    /**
     * @return The maximum-threshold for generated values
     */
    public double getValueMax() {
        return this.valueMax;
    }

    /**
     * @return The minimum-threshold for generated values
     */
    public double getValueMin() {
        return this.valueMin;
    }

    /**
     * @return The maximum-threshold for the time of generated values
     */
    public LocalDateTime getTimeMax() {
        return this.timeMax;
    }

    /**
     * @return The minumum-threshold for the time of generated values
     */
    public LocalDateTime getTimeMin() {
        return this.timeMin;
    }

    /**
     * Sets the count of data-points that should be generated
     *
     * @param count
     */
    public void setCount(int count) {
        this.count = count;
    }

    /**
     * Sets the maximum-threshold for generated values
     *
     * @param valueMax
     */
    public void setValueMax(double valueMax) {
        this.valueMax = valueMax;
    }

    /**
     * Sets the minimum-threshold for generated values
     *
     * @param valueMin
     */
    public void setValueMin(double valueMin) {
        this.valueMin = valueMin;
    }

    /**
     * Sets the maximum-threshold for the time of generated values
     *
     * @param timeMax
     */
    public void setTimeMax(LocalDateTime timeMax) {
        this.timeMax = timeMax;
    }

    /**
     * Sets the minimum-threshold for the time of generated values
     *
     * @param timeMin
     */
    public void setTimeMin(LocalDateTime timeMin) {
        this.timeMin = timeMin;
    }
}
