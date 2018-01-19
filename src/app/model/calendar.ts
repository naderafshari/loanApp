export interface Calendar {
  calId:        string;
  numOfSlots?:  number;
  slots?:       {};
  startTime?:   string;
  updateTime?:  string;
}

export interface Slot {
  id:           string; 
  description?: string;
  location:     string;
  subject?:     string; 
  calendar:     string;
  start:        string;
  end:          string;
}

export class DataClass {
  dataFields = [
    { name: "id",           type: "string" },
    { name: "description",  type: "string" },
    { name: "location",     type: "string" },
    { name: "subject",      type: "string" },
    { name: "calendar",     type: "string" },
    { name: "start",        type: "date" },
    { name: "end",          type: "date" }
  ]
}