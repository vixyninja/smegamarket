export interface IMail {
  from: string;
  to: string;
  subject: string;
  text: string;
  [key: string]: any;
}
