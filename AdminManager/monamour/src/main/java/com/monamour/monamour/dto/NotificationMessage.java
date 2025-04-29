package com.monamour.monamour.dto;

public enum NotificationMessage {

    REGISTERED("Welcome, {username}. Monamour staff is happy to have you there!"),
    EDIT_DETAILS("You succesfully edited the details of you profile! You changed your {details}!"),
    PROFILE_PICTURE("Successfully changed your profile picture!"),
    ORDER("Your order is created and you can see your order in profile settings.");

    private String message;
    NotificationMessage(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
    public String formatMessage(String... values) {
        String formattedMessage = message;
        if (values != null && values.length > 0) {
            formattedMessage = formattedMessage.replace("{username}", values[0]);
        }
        if (values != null && values.length > 0) {
            formattedMessage = formattedMessage.replace("{details}", values[0]);
        }
        return formattedMessage;
    }
}
