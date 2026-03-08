import { ESnackBarType } from "../enums/snack-bar-type.enum";

export interface ISnackbarData {
  message: string;
  type: ESnackBarType;
  duration: number;
}
