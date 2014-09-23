/*
 * This file defines built-in rules
 */

/*
 * Anyone
 */

Security.defineRule("allowAnyone", {
  types: ["insert", "update", "remove"],
  fetch: [],
  deny: function () {
    return false;
  }
});

Security.defineRule("allowAnyoneToInsert", {
  types: ["insert"],
  fetch: [],
  deny: function () {
    return false;
  }
});

Security.defineRule("allowAnyoneToUpdate", {
  types: ["update"],
  fetch: [],
  deny: function () {
    return false;
  }
});

Security.defineRule("allowAnyoneToRemove", {
  types: ["remove"],
  fetch: [],
  deny: function () {
    return false;
  }
});

/*
 * No one
 */

Security.defineRule("allowNoOne", {
  types: ["insert", "update", "remove"],
  fetch: [],
  deny: function () {
    return true;
  }
});

Security.defineRule("allowNoOneToInsert", {
  types: ["insert"],
  fetch: [],
  deny: function () {
    return true;
  }
});

Security.defineRule("allowNoOneToUpdate", {
  types: ["update"],
  fetch: [],
  deny: function () {
    return true;
  }
});

Security.defineRule("allowNoOneToRemove", {
  types: ["remove"],
  fetch: [],
  deny: function () {
    return true;
  }
});

/*
 * Logged In
 */

Security.defineRule("allowOnlyLoggedIn", {
  types: ["insert", "update", "remove"],
  fetch: [],
  deny: function (options, userId) {
    return !userId;
  }
});

Security.defineRule("allowOnlyLoggedInToInsert", {
  types: ["insert"],
  fetch: [],
  deny: function (options, userId) {
    return !userId;
  }
});

Security.defineRule("allowOnlyLoggedInToUpdate", {
  types: ["update"],
  fetch: [],
  deny: function (options, userId) {
    return !userId;
  }
});

Security.defineRule("allowOnlyLoggedInToRemove", {
  types: ["remove"],
  fetch: [],
  deny: function (options, userId) {
    return !userId;
  }
});

/*
 * Specific User ID
 */

Security.defineRule("allowOnlyUserId", {
  types: ["insert", "update", "remove"],
  fetch: [],
  deny: function (options, userId) {
    return userId !== options.userId;
  }
});

Security.defineRule("allowOnlyUserIdToInsert", {
  types: ["insert"],
  fetch: [],
  deny: function (options, userId) {
    return userId !== options.userId;
  }
});

Security.defineRule("allowOnlyUserIdToUpdate", {
  types: ["update"],
  fetch: [],
  deny: function (options, userId) {
    return userId !== options.userId;
  }
});

Security.defineRule("allowOnlyUserIdToRemove", {
  types: ["remove"],
  fetch: [],
  deny: function (options, userId) {
    return userId !== options.userId;
  }
});

/*
 * Specific Roles
 */

if (Package && Package["alanning:roles"]) {

  var Roles = Package["alanning:roles"].Roles;

  Security.defineRule("allowOnlyRoles", {
    types: ["insert", "update", "remove"],
    fetch: [],
    deny: function (options, userId) {
      return !Roles.userIsInRole(userId, options.roles);
    }
  });

  Security.defineRule("allowOnlyRolesToInsert", {
    types: ["insert"],
    fetch: [],
    deny: function (options, userId) {
      return !Roles.userIsInRole(userId, options.roles);
    }
  });

  Security.defineRule("allowOnlyRolesToUpdate", {
    types: ["update"],
    fetch: [],
    deny: function (options, userId) {
      return !Roles.userIsInRole(userId, options.roles);
    }
  });

  Security.defineRule("allowOnlyRolesToRemove", {
    types: ["remove"],
    fetch: [],
    deny: function (options, userId) {
      return !Roles.userIsInRole(userId, options.roles);
    }
  });

}
