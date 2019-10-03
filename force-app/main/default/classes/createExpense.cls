public with sharing class createExpense {

@AuraEnabled(cacheable=true)
    public static String callSheets(String cost) {
        HttpRequest req = new HttpRequest();
        String range = 'GastosB20:B20';
        String encodedRange = EncodingUtil.urlEncode(range, 'UTF-8');
        String endpoint = '1lCy8wDWpIemYmz6nYNCkeic1QGrJYimmuN90_ZQHSmw/values/'+encodedRange+':append';
req.setEndpoint('callout:Google/'+endpoint);
req.setMethod('POST');

//String myValue;
//myValue.add(cost);
List<String> myValuesList = new List<String> {};
myValuesList.add('cost');
Expense myExpense = new Expense(myValuesList);
String body = JSON.serialize(myExpense);
req.setBody(body);
Http http = new Http();
HTTPResponse res = http.send(req);
return res.getBody();

        
    }

    public class Expense{
    List<String> values;

    private Expense (List<String> values){
        this.values = values;
    }
}
}



