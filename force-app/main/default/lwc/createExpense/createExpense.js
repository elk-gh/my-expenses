import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import callSheets from "@salesforce/apex/createExpense.callSheets";

export default class CreateExpense extends LightningElement {
  @track response;
  @track error;
  @track isUSD = false;

  cantidad = "1.000";
  relacionado = "Elkin";
  direccion = "Egreso";
  tipo = "Recurrente";
  fecha;
  descripcion;
  empresa;
  moneda = "COP";
  tasa = "";

  expense;

  //Handlers
  handleChangeCantidad(event) {
    this.cantidad = event.detail.value;
  }

  handleChangeRelacionado(event) {
    this.relacionado = event.detail.value;
  }

  handleChangeDirecciones(event) {
    this.direccion = event.detail.value;
  }

  handleChangeTipos(event) {
    this.tipo = event.detail.value;
  }

  handleChangeFecha(event) {
    let lstFecha = event.detail.value.split("-");
    this.fecha = `${lstFecha[2]}/${lstFecha[1]}/${lstFecha[0]}`;
  }

  handleChangeDescripcion(event) {
    this.descripcion = event.detail.value;
  }

  handleChangeEmpresa(event) {
    this.empresa = event.detail.value;
  }

  handleChangeMonedas(event) {
    this.moneda = event.detail.value;
    if (this.moneda === "USD") {
      this.isUSD = true;
    } else {
      this.isUSD = false;
    }
  }

  handleChangeTasa(event) {
    this.tasa = event.detail.value;
  }

  handleResetForm() {
    this.isUSD = false;
    this.cantidad = "1.000";
    this.relacionado = "Elkin";
    this.direccion = "Egreso";
    this.tipo = "Recurrente";
    this.fecha = "";
    this.descripcion = "";
    this.empresa = "";
    this.moneda = "COP";
    this.tasa = "";
  }

  handleFormValidation() {
    const allValid = [
      ...this.template.querySelectorAll("lightning-input")
    ].reduce((validSoFar, inputCmp) => {
      inputCmp.reportValidity();
      return validSoFar && inputCmp.checkValidity();
    }, true);
    return allValid;
  }

  //Getters
  get monedas() {
    return [{ label: "COP", value: "COP" }, { label: "USD", value: "USD" }];
  }

  get tipos() {
    return [
      { label: "Único", value: "Único" },
      { label: "Recurrente", value: "Recurrente" }
    ];
  }

  get direcciones() {
    return [
      { label: "Egreso", value: "Egreso" },
      { label: "Ingreso", value: "Ingreso" }
    ];
  }

  createExpense() {
    if (this.handleFormValidation()) {
      this.expense = {
        cantidad: this.cantidad,
        relacionado: this.relacionado,
        tipo: this.tipo,
        fecha: this.fecha,
        descripcion: this.descripcion,
        empresa: this.empresa,
        moneda: this.moneda,
        tasa: this.tasa,
        direccion: this.direccion
      };
      callSheets({ jsonExpense: JSON.stringify(this.expense) })
        .then(result => {
          this.response = JSON.parse(result);
          this.error = undefined;
          const evt = new ShowToastEvent({
            title: "Exito",
            message: `${this.response.updates.updatedRows} fila(s) actualizada(s)`,
            variant: "success"
          });
          this.dispatchEvent(evt);
          this.handleResetForm();
        })
        .catch(error => {
          this.error = JSON.stringify(error);
          this.response = undefined;
          const evt = new ShowToastEvent({
            title: "Error",
            message: this.error,
            variant: "error"
          });
          this.dispatchEvent(evt);
        });
    } else {
      // eslint-disable-next-line no-alert
      alert("Por favor revise los errores e intente nuevamente.");
    }
  }
}
