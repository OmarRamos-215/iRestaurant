import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class InvoiceController {

  public async generateXML({request, auth}: HttpContextContract) {
    const params = request.all();
    const concepts = JSON.parse(params.concepts).concepts;
    console.log('++++++++',params)
    const cerFile = request.file('cerFile');
    const keyFile = request.file('keyFile');


    const CFDI = require('cfdi40');
    const path = require("path");
    
    // Multer Storage
    const multer = require("multer");
    const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/files');
      },
      filename: (req, file, cb) => {
        const fileextension = file.mimetype.split('/')[1];
        cb(null, `rim-${req.body.sku}-${Date.now()}.${fileextension}`);
      }
    });

    //setup file upload
    const upload = multer({
      storage: multerStorage
    });


    console.log(params);
    // Requires respective files on this folder
    const cer = path.join(__dirname, '30001000000400002335.cer');
    const key = path.join(__dirname, '30001000000400002335.key');

    let total = 0;
    let totalTransfer = 0;
    for (let index = 0; index < concepts.length; index++) {
      const concept = concepts[index];
      concept.quantity = Number(concept.quantity);
      concept.price = Number(concept.price);
      total += (concept.quantity * concept.price);
      totalTransfer += Number((concept.quantity*0.16).toFixed(2))*concept.quantity;
    }
    const date = params.currentDate.split('.')[0]
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
      Rfc: params.rfc_issuer,
      Nombre: params.issuer,
        RegimenFiscal: params.taxRegimen
    })

    cfdi.receptor({
        Rfc: params.rfc_receiver,
        Nombre: params.receiver,
        UsoCFDI: params.cfdiUse
    });

    for (let index = 0; index < concepts.length; index++) {
      const concept = concepts[index];
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

    const result = await cfdi.xmlSellado(key, '12345678a')
    .then(xml => {
      console.log(xml);
      return xml;
    })
    .catch(err => {
      console.log(err);
      return err
    });

    return { xml: result};
  }

  async generatePDF({request}: HttpContextContract) {
    const params = request.all();
    var moment = require('moment');
    for (let index = 0; index < params.concepts.length; index++) {
      params.concepts[index]['tax-rate'] = 16;
    }
    const date = params.currentDate.split('.')[0]
    const dateFormat = moment(date).format('DD-MM-YYYY');
    const dueDate = moment(date).add(15, 'days').format('DD-MM-YYYY');
    let easyInvoice = require('easyinvoice');

    const data = {
      /*"images": {
          // The logo on top of your invoice
          "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
          // The invoice background
          "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
      },*/
      // Your own data
      "sender": {
          //"company": "Sample Corp",
          "address": params.address,
          //"zip": "1234 AB",
          "city": "Chihuahua",
          "country": "México"
      },
      "information": {
          // Invoice number
          "number": params.invoiceNumber,
          "date": dateFormat,
          "due-date": dueDate
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      "products": params.concepts,
      // The message you would like to display on the bottom of your invoice
      //"bottom-notice": "Kindly pay your invoice within 15 days.",
      "settings": {
          "currency": "MXN", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      },
      // Translate your invoice to your preferred language
      "translate": {
          "invoice": "FACTURA",  // Default to 'INVOICE'
          "number": "Número", // Defaults to 'Number'
          "date": "Fecha", // Default to 'Date'
          "due-date": "Fecha Límite", // Defaults to 'Due Date'
          "subtotal": "Subtotal", // Defaults to 'Subtotal'
          "products": "Productos", // Defaults to 'Products'
          "quantity": "Cantidad", // Default to 'Quantity'
          "price": "Precio", // Defaults to 'Price'
          "product-total": "Total", // Defaults to 'Total'
          "total": "Total", // Defaults to 'Total'
          "vat": "iva" // Defaults to 'vat'
      },
    };

    
    let invoice = await easyInvoice.createInvoice(data)

    const result = {
      success: true,
      message: invoice,
    }
    
    return result
  }
}