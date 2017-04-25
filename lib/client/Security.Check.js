// We only stub on the client to prevent errors if putting in common code

Security.Check = class {
  constructor() {}

  for() {
    return this;
  }

  insert() {
    return this;
  }

  update() {
    return this;
  }

  remove() {
    return this;
  }

  read() {
    return this;
  }

  download() {
    return this;
  }

  check() {
    return true;
  }

  throw() {}
}
