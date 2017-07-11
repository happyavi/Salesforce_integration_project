public class Class1 {
 @future(callout = true) public static void callingapi(List < ID > newrecordids, String genstring) {
  Schema.SObjectType genobject = Schema.getGlobalDescribe().get(genstring);
  List < String > queryFields = new List < String > (genobject.getDescribe().fields.getMap().keySet());
  String joinedstring = String.join(queryFields, ',');
  if (genstring == 'Contact') {
   joinedstring = joinedstring + ',Account.Name';
  }
  HttpRequest req = new HttpRequest();
  HttpResponse res = new HttpResponse();
  Http http = new Http();
  req.setEndpoint('localEndPointVar');
  req.setMethod('POST');
  req.setCompressed(false);
  req.setHeader('Accept', 'text/plain');
  req.setHeader('Content-Type', 'application/json');
  for (ID a: newrecordids) {
   String genquery = 'SELECT ' + joinedstring + ' FROM ' + genstring + ' WHERE ' + 'id = :a';
   SObject newobject = Database.query(genquery);
   String data = System.Json.serialize(newobject);
   Map < String, String > dataMap = (Map < String, String > ) System.Json.deserialize(data.substringBefore('"attributes":{') + data.substringAfter('},'), Map < String, String > .class);
   Map < String, String > identifiers = new Map < String, String > {
    'field' => 'IfieldVar',
    +
    'licensecode' => 'licensecodeVar',
    +
    'type' => genstring
   };
   Map < String, Map < String, String > > jsonmap = new Map < String, Map < String, String >> {
    'allvalues' => datamap,
    'identifiers' => identifiers
   };
   req.setBody(Json.serialize(jsonmap));
   res = http.send(req);
  }
 }
}