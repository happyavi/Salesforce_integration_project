trigger Trigger3 on Lead(after update) {
 Lead LObject = new Lead();
 Schema.SObjectType objType = LObject.getSObjectType();
 Map < String, Schema.SObjectField > M = Schema.SObjectType.Lead.fields.getMap();
 List < Map < String, String > > leadMap = new List < Map < String, String > > ();
 for (Lead L: trigger.new) {
  Lead oldField = trigger.oldMap.get(L.Id);
  Schema.SObjectType sobjectType = L.id.getSObjectType();
  String sobjectName = sobjectType.getDescribe().getName();
  for (String str: M.keyset()) {
   if (L.get(str) != oldField.get(str)) {
    leadMap.add(new Map < String, String > {
     'NewValue' => String.valueOf(L.get(str)),
     'OldValue' => String.valueOf(oldField.get(str)),
     'Attribute' => String.valueOf(str),
     'Name' => String.valueOf(sobjectType),
     'Id' => String.valueOf(L.IfieldVar)
    });
   }
  }
 }
 Map < String, String > identifiers = new Map < String, String > {
  'field' => 'IfieldVar',
  'licensecode' => 'licensecodeVar'
 };
 leadMap.add(identifiers);
 Class2.Lead_Updating(JSON.serialize(leadMap));
}