export interface IExportPDFInput {
  html: string;
  margin: IMarginInput | null;
}

export interface IMarginInput {
  top: string;
  bottom: string;
  left: string;
  right: string;
}
