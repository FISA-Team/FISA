package de.fraunhofer.iosb.ilt.fisabackend.controller;

import java.util.UUID;

public class MapNameListElement {
    private String name;
    private UUID uuid;

    /**
     * New ListElement with Name and UUID
     * @param name
     * @param uuid
     */
    public MapNameListElement(String name, UUID uuid) {
        this.name = name;
        this.uuid = uuid;
    }

    /**
     * @return The name of the ListElement
     */
    public String getName() {
        return name;
    }

    /**
     * @return The UUID of the ListElement
     */
    public UUID getUuid() {
        return uuid;
    }
}
