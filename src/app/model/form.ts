export interface Form {
    formName: string;
    startTime: string;
    updateTime: string;
    field1: {
        fieldName: string;
        fieldType: string;
        fieldValue: string;
    };
    field2: {
        fieldName: string;
        fieldType: string;
        fieldValue: string;
    };
}
