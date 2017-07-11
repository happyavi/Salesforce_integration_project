public class Class2 {
 @future(callout = true) public static void Lead_Updating(String leadMap) {
  HttpRequest req = new HttpRequest();
  HttpResponse res = new HttpResponse();
  Http http = new Http();
  req.setEndpoint('localEndPointVar/update');
  req.setMethod('POST');
  req.setCompressed(false);
  req.setHeader('Accept', 'text/plain');
  req.setHeader('Content-Type', 'application/json');
  req.setBody(leadMap);
  res = http.send(req);
 }
}