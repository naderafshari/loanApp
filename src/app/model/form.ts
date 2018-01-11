export interface Field {
    name: string;
    required: boolean;
    type: string;
    mask?: string;
    numOfOptions?: number;
    options?: {};
    value: string;
}

export interface Form {
  formId: string;
  formName: string;
  numOfFields?: number;
  startTime?: string;
  updateTime?: string;
}

export class FormClass {
  form = <Form> {
      formId: '',
      formName: '',
      numOfFields: 0,
      startTime: '',
      updateTime: ''
  };
}
