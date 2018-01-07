export interface Field {
    name: string;
    required: boolean;
    type: string;
    numOfOptions?: number;
    options?: {};
    value: string;
    option1?: string;
    option2?: string;
    option3?: string;
    option4?: string;
    option5?: string;
    option6?: string;
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
