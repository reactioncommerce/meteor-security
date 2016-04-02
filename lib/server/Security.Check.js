Security.Check = class {
  constructor(userId) {
    this.userId = userId || null;
  }

  for(collection) {
    this.collection = collection;
    this.collectionName = getCollectionName(collection);
    return this;
  }

  insert(doc, ...args) {
    if (this.type) throw new Error(Security.errorMessages.multipleCan);
    this.type = 'insert';
    this.doc = doc;
    this.args = args;
    return this;
  }

  update(doc, modifier, ...args) {
    if (this.type) throw new Error(Security.errorMessages.multipleCan);
    this.type = 'update';
    this.doc = doc;
    this.modifier = modifier;
    this.args = args;
    return this;
  }

  remove(doc, ...args) {
    if (this.type) throw new Error(Security.errorMessages.multipleCan);
    this.type = 'remove';
    this.doc = doc;
    this.args = args;
    return this;
  }

  read(doc, ...args) {
    if (this.type) throw new Error(Security.errorMessages.multipleCan);
    this.type = 'read';
    this.doc = doc;
    this.args = args;
    return this;
  }

  // EXAMPLES:
  // Security.can(userId).insert(doc).for(MyCollection).check()
  // Security.can(userId).update(id, modifier).for(MyCollection).check()
  // Security.can(userId).remove(id).for(MyCollection).check()
  check() {
    // Select only those rules that apply to this operation type
    const rules = getRulesForCollectionAndType(this.collectionName, this.type);

    // If this.doc is an ID, we will look up the doc, fetching only the fields needed.
    // To find out which fields are needed, we will combine all the `fetch` arrays from
    // all the restrictions in all the rules.
    if (typeof this.doc === 'string' || this.doc instanceof MongoID.ObjectID) {
      let fields = {};
      _.every(rules, rule => {
        const fetch = rule.combinedFetch();
        if (fetch === null) {
          fields = null;
          return false; // Exit loop
        }
        rule.combinedFetch().forEach(field => {
          fields[field] = 1;
        });
        return true;
      });

      let options = {};
      if (fields) {
        if (_.isEmpty(fields)) {
          options = {_id: 1};
        } else {
          options = {fields};
        }
      }
      this.doc = this.collection.findOne(this.doc, options);
    }

    // Loop through all defined rules for this collection. There is an OR relationship among
    // all rules for the collection, so if any "allow" function DO return true, we allow.
    return _.any(rules, rule => rule.allow(this.type, this.collection, this.userId, this.doc, this.modifier, ...this.args));
  }

  // EXAMPLES:
  // Security.can(userId).insert(doc).for(MyCollection).throw()
  // Security.can(userId).update(id, modifier).for(MyCollection).throw()
  // Security.can(userId).remove(id).for(MyCollection).throw()
  throw() {
    if (!this.check()) throw new Meteor.Error('access-denied', Security.errorMessages.notAllowed);
  }
}
