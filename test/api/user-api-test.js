import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { maggie, notAdmin, testUsers } from "../fixtures.js";
import { placemarkService } from "./placemark-service.js";

suite("User API tests", () => {
  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    await placemarkService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      delete testUsers[i]._id;
      delete testUsers[i].__v;
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await placemarkService.createUser(testUsers[i]);
    }

    delete maggie._id;
    delete maggie.__v;
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
  });
  teardown(async () => {});

  test("create a user", async () => {
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all users", async () => {
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user - success", async () => {
    const returnedUser = await placemarkService.getUser(testUsers[0]._id);
    assert.deepEqual(testUsers[0], returnedUser);
  });

  test("delete One User - success", async () => {
    try {
      const originalUsers = await placemarkService.getAllUsers();
      assert.equal(originalUsers.length, testUsers.length + 1);
      await placemarkService.deleteUserById(testUsers[0]._id);
      const returnedUsers = await placemarkService.getAllUsers();
      assert.equal(returnedUsers.length, testUsers.length);
      await placemarkService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (e) {
      assert(e.response.data.message === "No User with this id");
      assert.equal(e.response.data.statusCode, 404);
    }
  });

  test("delete One User - not admin", async () => {
    try {
      placemarkService.clearAuth();
      await placemarkService.createUser(notAdmin);
      await placemarkService.authenticate(notAdmin);
      await placemarkService.deleteUserById(testUsers[1]._id);
      assert.fail("Should not return a response");
    } catch (e) {
      assert(e.response.data.message === "User does not exist or is not an admin");
      assert.equal(e.response.data.statusCode, 401);
    }
  });

  test("delete all users - not admin", async () => {
    try {
      placemarkService.clearAuth();
      await placemarkService.createUser(notAdmin);
      await placemarkService.authenticate(notAdmin);
      await placemarkService.deleteAllUsers();
      assert.fail("Should not return a response");
    } catch (e) {
      assert(e.response.data.message === "User does not exist or is not an admin");
      assert.equal(e.response.data.statusCode, 401);
    }
  });

  test("get a user - bad id", async () => {
    try {
      await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a user - deleted user", async () => {
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    try {
      const returnedUser = await placemarkService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
