export enum MessageType {
    clickExtIcon = "clickExtIcon",
    changeTheme = "changeTheme",
    changeLocale = "changeLocale",
    openSidePanel = "openSidePanel",
    getSelectedText = "getSelectedText"
}

export enum MessageFrom {
    contentScript = "contentScript",
    background = "background",
    popUp = "popUp",
    sidePanel = "sidePanel",
}

class ExtMessage {
    content?: string;
    from?: MessageFrom;
    selectedText?: string;

    constructor(messageType: MessageType) {
        this.messageType = messageType;
    }

    messageType: MessageType;
}

export default ExtMessage;
