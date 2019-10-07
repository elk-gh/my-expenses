public with sharing class createExpense {

@AuraEnabled(cacheable=true)
public static String callSheets(String jsonExpense) {
	System.debug(jsonExpense);
	Expense expense = (Expense) JSON.deserialize(jsonExpense, Expense.class);
	HttpRequest req = new HttpRequest();
	String IndexToInsert = getIndexForSheet();
	String range = 'Gastos!B'+IndexToInsert+':C'+IndexToInsert;
	String encodedRange = EncodingUtil.urlEncode(range, 'UTF-8');
	String endpoint = 'spreadsheets/1lCy8wDWpIemYmz6nYNCkeic1QGrJYimmuN90_ZQHSmw/values/'+range+':append?valueInputOption=RAW';
	System.debug(endpoint);
	req.setEndpoint('callout:Mis_Gastos/'+endpoint);
	req.setMethod('POST');
	String body = '';
	body+='{"values": [["'+expense.direccion+'","'+expense.tipo+'","'+expense.fecha;
	body+='","'+expense.descripcion+'","'+expense.empresa+'","$'+expense.cantidad+',00';
	body+='","'+expense.moneda+'","'+expense.tasa+'","'+expense.relacionado+'"]]}';
	System.debug(body);
	req.setHeader('Content-Type','application/json');
	req.setBody(body);
	Http http = new Http();
	HTTPResponse res = http.send(req);
	System.debug(res.getBody());
	return res.getBody();
}

private static String getIndexForSheet(){
	HttpRequest req = new HttpRequest();
	req.setEndpoint('callout:Mis_Gastos/spreadsheets/1lCy8wDWpIemYmz6nYNCkeic1QGrJYimmuN90_ZQHSmw/values/Gastos!A:A');
	req.setMethod('GET');
	Http http = new Http();
	HTTPResponse res = http.send(req);

// Parse JSON response to get last filled row.
	JSONParser parser = JSON.createParser(res.getBody());
	Integer count = 0;
	while (parser.nextToken() != null) {
		//find the values array
		if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) &&
		    (parser.getText() == 'values')) {
			//find the array value
			parser.nextToken();
			//iterate the values array
			while (parser.nextToken() != null) {
				//find each element
				if(parser.getCurrentToken() == JSONToken.START_ARRAY) {
					//find the value for each element
					parser.nextToken();
					//count for each element except the one with the title
					if(parser.getText() != 'Orden') {
						System.debug(parser.getText());
						count++;
					}
				}
			}
		}
	}

	return String.valueOf(count + 2);
}

public class Expense {
String cantidad;
String relacionado;
String tipo;
String fecha;
String descripcion;
String empresa;
String moneda;
String tasa;
String direccion;
}
}



