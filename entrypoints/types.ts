export enum MessageType {
    clickExtIcon = "clickExtIcon",
    changeTheme = "changeTheme",
    changeLocale = "changeLocale",
    openSidePanel = "openSidePanel",
    getSelectedText = "getSelectedText",
    wikipediaNavigation = "wikipediaNavigation",
    navigateToWikipedia = "navigateToWikipedia",
    // Tracking mode messages
    startTracking = "startTracking",
    stopTracking = "stopTracking",
    trackNavigation = "trackNavigation",
    getMode = "getMode",
    modeChanged = "modeChanged",
    // Session management
    saveSession = "saveSession",
    saveSessionConfirmed = "saveSessionConfirmed",
    clearSession = "clearSession",
    loadSession = "loadSession",
    setLoadedTreeInfo = "setLoadedTreeInfo",
    getSessions = "getSessions",
    deleteSession = "deleteSession"
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
    articleTitle?: string;
    articleUrl?: string;
    mode?: string;
    sessionId?: string;
    sessionName?: string;
    tabId?: number;
    promptUser?: boolean;
    nodeCount?: number;
    isLoadedTree?: boolean;
    originalTreeId?: string;
    originalTreeName?: string;
    initialArticleTitle?: string;

    constructor(messageType: MessageType) {
        this.messageType = messageType;
    }

    messageType: MessageType;
}

export default ExtMessage;
