@IsTest public class Class3 {
 private static testMethod void myUnitTest() {
  Lead lead = new Lead(LastName = 'Doe', FirstName = 'John', Company = 'Test', Status = 'Converted');
  insert lead;
  lead = [SELECT Id, Status, FirstName, LastName, Company, LeadSource FROM Lead WHERE Id = : lead.Id];
  System.assertEquals('Converted', lead.Status);
  update lead;
  StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
  mock.setStaticResource('LeadUpdation');
  mock.setStatusCode(200);
  mock.setHeader('Content-Type', 'application/json');
  Test.setMock(HttpCalloutMock.class, mock);
 }
}