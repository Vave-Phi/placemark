import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers } from "../fixtures.js";
import { db } from "../../src/models/db.js";
import { placemarkService } from "./placemark-service.js";

suite("User API tests", () => {
  setup(async () => {
    await db.initMongo();
    await placemarkService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      delete testUsers[i]._id;
      delete testUsers[i].__v;
      testUsers[i] = await placemarkService.createUser(testUsers[i]);
    }
    delete maggie._id;
    delete maggie.__v;
  });
  teardown(async () => {});

  test("create a user", async () => {
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all users", async () => {
    let returnedUsers = await placemarkService.getAllUsers();
    console.log(returnedUsers);
    assert.equal(returnedUsers.length, 3);
    await placemarkService.deleteAllUsers();
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const returnedUser = await placemarkService.getUser(testUsers[0]._id);
    assert.deepEqual(testUsers[0], returnedUser);
  });

  test("delete One User - success", async () => {
    try {
      await placemarkService.deleteUserById(testUsers[0]._id);
      const returnedUsers = await placemarkService.getAllUsers();
      assert.equal(returnedUsers.length, testUsers.length - 1);
      const deletedUser = await placemarkService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (e) {
      assert(e.response.data.message === "No User with this id");
      assert.equal(e.response.data.statusCode, 404);
    }
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a user - deleted user", async () => {
    await placemarkService.deleteAllUsers();
    try {
      const returnedUser = await placemarkService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
