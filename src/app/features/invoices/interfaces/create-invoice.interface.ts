export interface ICreateInvoiceRequest {
  companyId: string;
  branchId: string;
  fechaEmision: string;
  currency: string;
  receiptTypeId: string;
  documentSeriesId: string;
  paymentTerm: string;
  operationType: string;
  sale: ISaleInfo;
  customer: ICustomerInfo;
  items: IInvoiceItem[];
}

export interface ISaleInfo {
  moneda_id: string;
  forma_pago_id: string;
  codigo_documento: string;
}

export interface ICustomerInfo {
  razon_social_nombres: string;
  numero_documento: string;
  cliente_direccion: string;
  ubigeo: string;
}

export interface IInvoiceItem {
  producto: string;
  cantidad: string;
  mtoPrecioUnitario: string;
  codigo_producto: string;
  tipo_afectacion_igv: string;
  mtoIgv: number;
}
