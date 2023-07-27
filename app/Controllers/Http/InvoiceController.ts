import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InvoiceController {

  public async generateXML({request, auth}: HttpContextContract) {
    const params = request.all();
    const CFDI = require('cfdi40');
    const path = require("path");
    
    // Requires respective files on this folder
    const cer = path.join(__dirname, '30001000000400002335.cer');
    const key = path.join(__dirname, '30001000000400002335.key');

    let total = 0;
    let totalTransfer = 0;
    for (let index = 0; index < params.concepts.length; index++) {
      const concept = params.concepts[index];
      total += (concept.quantity * concept.price);
      totalTransfer += Number((concept.quantity*0.16).toFixed(2))*concept.quantity;
    }
    const date = params.date.split('.')[0]
    const subtotal = Number((total / 1.16).toFixed(2));

    const cfdi = new CFDI({
        Serie: 'A',
        Folio: '167ABC',
        Fecha: date,
        SubTotal: `${subtotal}`,
        Moneda: 'MXN',
        Total: `${total}`,
        TipoDeComprobante: 'I', // Ingreso
        FormaPago: params.paymentForm, // 01 Efectivo
        MetodoPago: 'PUE', // Pago en una sola expedición
        CondicionesDePago: 'CONDICIONES',
        Descuento: '0.00',
        TipoCambio: '1',
        LugarExpedicion: '45079'
    });

    cfdi.emisor({
      Rfc: params.emisor.rfc,
      Nombre: params.emisor.name,
        RegimenFiscal: params.emisor.taxRegimen
    })

    cfdi.receptor({
        Rfc: params.receptor.rfc,
        Nombre: params.receptor.name,
        UsoCFDI: params.receptor.cfdiUse
    });

    for (let index = 0; index < params.concepts.length; index++) {
      const concept = params.concepts[index];
      const individual = Number((concept.price/1.16).toFixed(2));
      const conceptImport = individual*concept.quantity;
      const tranferImport = (Number((concept.price*0.16).toFixed(2)))*concept.quantity;
      const conceptCFDI = cfdi.concepto({
        ClaveProdServ: '90101501', //Restaurantes
        ClaveUnidad: 'E48',
        NoIdentificacion: '3031130179',
        Cantidad: `${concept.quantity}`,
        Unidad: 'PZ', // ??
        Descripcion: concept.description,
        ValorUnitario: `${individual}`,
        Importe: `${conceptImport}`
    });
      conceptCFDI.traslado({
          Base: `${subtotal}`,
          Impuesto: '002', // IVA
          TipoFactor: 'Tasa',
          TasaOCuota: '0.16',
          Importe: `${tranferImport}`
      });

      conceptCFDI.agregar(cfdi);

    }


    cfdi.impuestos({
        TotalImpuestosTrasladados: `${totalTransfer}`,
        Traslados: [
          {
            Impuesto: '002',
            TipoFactor: 'Tasa',
            TasaOCuota: '0.16',
            Importe: `${totalTransfer}`
          }
        ]
    });

    cfdi.certificar(cer);

    const result = cfdi.xmlSellado(key, '12345678a')
    .then(xml => {
      console.log(xml);
      return xml;
    })
    .catch(err => {
      console.log(err);
      return err
    });

    return result;
  }

  async generatePDF({request}: HttpContextContract) {
    const params = request.all();
    let easyInvoice = require('easyinvoice');
    let invoice = easyInvoice.createInvoice(params)

    const result = {
      success: true,
      message: invoice,
    }
    
    return result
  }
}