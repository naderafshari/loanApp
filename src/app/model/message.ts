export interface Message {
    msgid: string;
    sid: string;
    sName: string;
    rid: string;
    rName: string;
    subject?: string;
    message?: string;
    opened: boolean;
    archived: boolean;
    timeStamp: string;
}
