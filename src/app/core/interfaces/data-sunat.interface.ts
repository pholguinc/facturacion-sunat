export interface IDataSunatResponse {
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  estado: string;
  condicion: string;
  direccion: string;
  domicilioFiscal?: string;
  localesAnexos?: string;
  ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  esAgenteRetencion: boolean;
  esBuenContribuyente: boolean;
  tipo: string;
  tipoContribuyente?: string;
  actividadEconomica: string;
  numeroTrabajadores: string;
  numeroEmpleados?: string;
  tipoFacturacion: string;
  tipoContabilidad: string;
  comercioExterior: string;
  igv?: number;
  tipoCambio?: number;
  correo?: string;
  telefono?: string;
  certificado?: string;
  claveCertificado?: string;
  usuarioSecundarioProduccion?: string;
  claveUsuarioSecundarioProduccion?: string;
}

export interface IApiSunatResponse {
  statusCode: number;
  message: string;
  data: IDataSunatResponse;
}
