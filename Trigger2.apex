trigger Trigger2 on Contact(after insert, after update) {
 String objectStr = 'Contact';
 List < ID > newcontactids = new List < ID > ();
 for (Contact a: Trigger.new) {
  newcontactids.add(a.Id);
 }
 Class1.callingapi(newcontactids, objectStr);
}