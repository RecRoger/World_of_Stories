import { AlertTypes } from "@core/models/constants";

export interface AlertMessage {
  alertType: AlertTypes;
  text: string;
  time: Date;
}