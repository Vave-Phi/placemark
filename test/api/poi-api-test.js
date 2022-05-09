import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { testPoi, testPoiChanges, testPois } from "../fixtures.js";
import { db } from "../../src/models/db.js";
import { placemarkService } from "./placemark-service.js";

suite("Poi API tests", () => {
  setup(async () => {
    await db.initMongo();
    await placemarkService.deleteAllPois();
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      delete testPois[i]._id;
      delete testPois[i].__v;
      testPois[i] = await placemarkService.createPoi(testPois[i]);
    }
    delete testPoi._id;
    delete testPoi.__v;
  });
  teardown(async () => {});

  test("create a poi", async () => {
    const newPoi = await placemarkService.createPoi(testPoi);
    assertSubset(testPoi, newPoi);
    assert.isDefined(newPoi._id);
  });

  test("delete all pois", async () => {
    let returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, 3);
    await placemarkService.deleteAllPois();
    returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, 0);
  });

  test("get a poi - success", async () => {
    const returnedPoi = await placemarkService.getPoi(testPois[0]._id);
    assert.deepEqual(testPois[0], returnedPoi);
  });

  test("delete One Poi - success", async () => {
    try {
      await placemarkService.deletePoiById(testPois[0]._id);
      const returnedPois = await placemarkService.getAllPois();
      assert.equal(returnedPois.length, testPois.length - 1);
      const deletedPoi = await placemarkService.getPoi(testPois[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Poi with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("update One Poi - success", async () => {
    const testPoiBefore = testPois[0];
    const updatedPoi = await placemarkService.updatePoi(testPoiBefore._id, testPoiChanges);
    assertSubset(testPoiChanges, updatedPoi);
    assert.notDeepEqual(updatedPoi, testPoiBefore);
  });

  test("get a poi - bad id", async () => {
    try {
      const returnedPoi = await placemarkService.getPoi("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Poi with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a poi - deleted poi", async () => {
    await placemarkService.deleteAllPois();
    try {
      const returnedPoi = await placemarkService.getPoi(testPois[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Poi with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("update One Poi - bad id", async () => {
    const pois = await placemarkService.getAllPois();
    try {
      await placemarkService.updatePoi("badId", testPoiChanges);
    } catch (e) {
      assert.deepEqual(pois, await placemarkService.getAllPois());
    }
  });
});
