var newCfdi40= 
{
    "Receiver": {
        "Name": "UNIVERSIDAD ROBOTICA ESPAÑOLA",
        "CfdiUse": "G03",
        "Rfc": "URE180429TM6",
        "FiscalRegime": "601",
        "TaxZipCode": "65000"        
    },
    "CfdiType": "I",
    "NameId": "1",
    "ExpeditionPlace": "26015",
    "Serie": null,
    "Folio": "V8",
    "PaymentForm": "01",
    "PaymentMethod": "PUE",
    "Exportation": "01",
    "Items": [
        {
            "Quantity": "1",
            "ProductCode": "10111302",
            "UnitCode": "H87",
            "Unit": "Pieza",
            "Description": "producto prueba cfdi4.0",
            "IdentificationNumber": "papc40",
            "UnitPrice": "1.00",
            "Subtotal": "1.00",
            "TaxObject": "02",
            "Taxes": [
                {
                    "Name": "IVA",
                    "Rate": "0.16",
                    "Total": "0.16",
                    "Base": "1",
                    "IsRetention": "false",
                    "IsFederalTax": "true"
                }
            ],
            "Total": "1.16"
        }
    ]
};


var clientUpdate;

function testCRUDCfdi40() {
	var cfdi;

	//creación de un cfdi 4.0 con errores
	/*
	Facturama.Cfdi.Create(newCfdi, function(result){ 
		cfdi = result;
		console.log("creacion",result);
    
	}, function(error) {
		if (error && error.responseJSON) {
            console.log("Errores", error.responseJSON);
        }		
	});*/
	
	//creación de un cfdi 4.0
	newCfdi40.ExpeditionPlace = "78140";
	Facturama.Cfdi.Create3(newCfdi40, function(result)
	{ 
		cfdi = result;
		Cfdi_Id=cfdi.Id;
		console.log("Creación",result);
    

		//descargar el PDF del cfdi
		Facturama.Cfdi.Download("pdf", "issued", Cfdi_Id, function(result){
			console.log("Descarga",result);

			blob = converBase64toBlob(result.Content, 'application/pdf');

			var blobURL = URL.createObjectURL(blob);
			window.open(blobURL);
		});

		//descargar el XML del cfdi
		Facturama.Cfdi.Download("xml", "issued", Cfdi_Id, function(result){
			console.log("Descarga",result);

			blob = converBase64toBlob(result.Content, 'application/xml');

			var blobURL = URL.createObjectURL(blob);
			window.open(blobURL);
		});

		//eliminar el cfdi creado
		var _type="issued";			//Valores posibles (issued | payroll)
		var _motive="02"; 			//Valores Posibles (01|02|03|04)
		var _uuidReplacement="null";	//(uuid | null)
		Facturama.Cfdi.Cancel(Cfdi_Id + "?type=" + _type + "&motive=" + _motive + "&uuidReplacement=" +_uuidReplacement , function(result){ 
			console.log("Eliminado",result);
		});

		// //obtener todos los cfdi con cierto rfc
		var rfc = "EKU9003173C9";
		Facturama.Cfdi.List("?type=issued&keyword=" + rfc, function(result){ 
			clientUpdate = result;
			console.log("todos",result);
		});

        //enviar el cfdi al cliente
		var email = "ejemplo@ejemplo.mx";
	    var type = "issued";
        //console.log("Id del la factura: ",Cfdi_Id);
	    Facturama.Cfdi.Send("?cfdiType=" + type + "&cfdiId=" + Cfdi_Id + "&email=" + email, function(result){ 
			console.log("envio", result);
		});

		

	}, function(error) {
		if (error && error.responseJSON) {
            console.log("Errores", error.responseJSON);
        }
		
	});
}

function converBase64toBlob(content, contentType) {
	contentType = contentType || '';
	var sliceSize = 512;
	var byteCharacters = window.atob(content); //method which converts base64 to binary
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);
		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
	  		byteNumbers[i] = slice.charCodeAt(i);
		}
		var byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {type: contentType}); //statement which creates the blob
	return blob;
}
