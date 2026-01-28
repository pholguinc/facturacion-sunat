import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';
import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { NgxValidators } from '@/app/core/helpers/ngx-validator';
import { ExternalServicesService } from '@/app/core/services/external-services.service';
import { firstValueFrom } from 'rxjs';
import { IDataSunatResponse } from '@/app/core/interfaces/data-sunat.interface';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { CompaniesService } from '../../services/companies.service';
import { MatDialog } from '@angular/material/dialog';
import { CertificatePasswordDialogComponent } from '../certificate-password-dialog/certificate-password-dialog.component';
import { ICertificateValidityResponse } from '../../interfaces/certificate.interface';

@Component({
  selector: 'app-create-new-company',
  imports: [
    MatFormField,
    MatLabel,
    MatInputModule,
    MatIcon,
    MatIconButton,
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    ControlErrorsDirective,
    FormSubmitDirective,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  templateUrl: './create-new-company.component.html',
  styleUrl: './create-new-company.component.scss',
})
export class CreateNewCompanyComponent {
  constructor(
    private externalServices: ExternalServicesService,
    private companiesService: CompaniesService,
    private dialog: MatDialog,
  ) {}

  loading: boolean = false;
  dataSunat: IDataSunatResponse | null = null;
  uploadingCertificate: boolean = false;

  searchForm = new FormGroup({
    ruc: new FormControl('', [NgxValidators.required('El RUC es obligatorio')]),
  });

  companiesForm = new FormGroup({
    // General
    ruc: new FormControl('', [NgxValidators.required('El RUC es obligatorio')]),
    razonSocial: new FormControl('', [
      NgxValidators.required('La razón social es obligatoria'),
    ]),
    nombreComercial: new FormControl(''),
    estado: new FormControl(''),
    condicion: new FormControl(''),
    tipoContribuyente: new FormControl(''),

    // Location
    direccion: new FormControl(''),
    domicilioFiscal: new FormControl(''),
    localesAnexos: new FormControl(''),
    ubigeo: new FormControl(''),
    departamento: new FormControl(''),
    provincia: new FormControl(''),
    distrito: new FormControl(''),

    // Details
    esAgenteRetencion: new FormControl(false),
    esBuenContribuyente: new FormControl(false),
    actividadEconomica: new FormControl(''),
    numeroEmpleados: new FormControl(''),

    // Settings & Contact
    correo: new FormControl('', [Validators.email]),
    telefono: new FormControl(''),
    igv: new FormControl(18),
    tipoCambio: new FormControl(0),

    // Credentials
    certificado: new FormControl(''),
    claveCertificado: new FormControl(''),
    usuarioSecundarioProduccion: new FormControl(''),
    claveUsuarioSecundarioProduccion: new FormControl(''),
  });

  async onSearch() {
    if (this.searchForm.invalid) return;
    const ruc = this.searchForm.get('ruc')?.value;
    if (!ruc) return;

    await this.loadDataSunat(ruc);
  }

  clearSearch() {
    this.searchForm.get('ruc')?.setValue('');
    this.dataSunat = null;
    this.companiesForm.reset({
      igv: 18,
      tipoCambio: 0,
    });
  }

  private async loadDataSunat(ruc: string): Promise<void> {
    try {
      this.loading = true;
      const response = await firstValueFrom(
        this.externalServices.getDataSunat(ruc),
      );
      this.dataSunat = response.data;
      if (this.dataSunat) {
        this.companiesForm.patchValue({
          ruc: this.dataSunat.ruc,
          razonSocial: this.dataSunat.razonSocial,
          nombreComercial: this.dataSunat.nombreComercial || '',
          estado: this.dataSunat.estado,
          condicion: this.dataSunat.condicion,
          tipoContribuyente: this.dataSunat.tipo || '',
          direccion: this.dataSunat.direccion,
          domicilioFiscal:
            this.dataSunat.domicilioFiscal || this.dataSunat.direccion,
          localesAnexos: this.dataSunat.localesAnexos || '',
          ubigeo: this.dataSunat.ubigeo,
          departamento: this.dataSunat.departamento,
          provincia: this.dataSunat.provincia,
          distrito: this.dataSunat.distrito,
          esAgenteRetencion: this.dataSunat.esAgenteRetencion,
          esBuenContribuyente: this.dataSunat.esBuenContribuyente,
          actividadEconomica: this.dataSunat.actividadEconomica,
          numeroEmpleados:
            this.dataSunat.numeroEmpleados || this.dataSunat.numeroTrabajadores,
        });
      }
      console.log(this.dataSunat);
    } catch (error) {
      console.error('Error cargando datos de SUNAT', error);
      this.dataSunat = null;
    } finally {
      this.loading = false;
    }
  }

  onSave() {
    if (this.companiesForm.invalid) return;
    console.log('Guardando empresa:', this.companiesForm.value);
  }

  onCancel() {
    this.clearSearch();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // ✅ VALIDAR ARCHIVO
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pfx', 'p12'].includes(extension ?? '')) {
      alert('❌ El archivo debe ser un certificado digital (.pfx o .p12)');
      input.value = '';
      return;
    }

    // 🔐 Pedir contraseña
    const dialogRef = this.dialog.open(CertificatePasswordDialogComponent, {
      width: '450px',
      disableClose: true,
    });

    const password = await firstValueFrom(dialogRef.afterClosed());
    if (!password) {
      input.value = '';
      return;
    }

    try {
      this.uploadingCertificate = true;

      const response = await firstValueFrom(
        this.companiesService.convertPFXtoPem(file, password),
      );

      if (response.data?.pem) {
        const validity = await this.certificateValidity(response.data.pem);
        if (validity.isValid) {
          this.companiesForm.patchValue({
            certificado: response.data.pem,
            claveCertificado: password,
          });
        }
      }
    } catch (error) {
      console.error(error);
      alert('❌ Error al procesar el certificado');
    } finally {
      this.uploadingCertificate = false;
      input.value = '';
    }
  }

  async certificateValidity(
    pemContent: string,
  ): Promise<ICertificateValidityResponse['data']> {
    const response = await firstValueFrom(
      this.companiesService.certificateValidity(pemContent),
    );

    console.log('📜 Certificado recibido:', response);
    const data = response.data;

    console.log('📜 Certificado recibido:', data);

    if (!data.isValid) {
      alert('⚠️ El certificado digital ha expirado');
    } else if (data.daysRemaining <= 30) {
      alert(`⚠️ El certificado expirará en ${data.daysRemaining} días`);
    } else {
      console.log(
        `✅ Certificado válido (${data.daysRemaining} días restantes)`,
      );
    }

    return data;
  }
}
