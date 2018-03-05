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

export interface QueryConfig {
    path: string; //  path to collection
    field: string; // field to orderBy
    limit: number; // limit per query
    reverse: boolean; // reverse order?
    prepend: boolean; // prepend to source?
}
