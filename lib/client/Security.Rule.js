// We only stub on the client to prevent errors if putting in common code

Security.Rule = class {
  constructor(types) {}

  collections(collections) {
    return this;
  }

  allowInClientCode() {}

  allow() {
    return true;
  }
}
