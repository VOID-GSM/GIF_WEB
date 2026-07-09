export interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export interface TimePickerProps {
  /** "HH:mm" */
  value: string;
  onChange: (time: string) => void;
}
