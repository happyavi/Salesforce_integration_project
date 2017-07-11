trigger Trigger1 on Lead(after insert) {
 String objectStr = 'Lead';
 List < ID > newleadids = new List < ID > ();
 for (Lead a: Trigger.new) {
  newleadids.add(a.Id);
 }
 Class1.callingapi(newleadids, objectStr);
}