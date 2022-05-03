import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPoi, testPoiChanges, testPois } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

function runTestSuite(dbInit, name) {
  suite(`Poi API tests (${name})`, () => {
    setup(async () => {
      dbInit();
      await db.poiStore.deleteAll();
      delete testPoi._id;
      for (let i = 0; i < testPois.length; i += 1) {
        delete testPois[i]._id;
        // eslint-disable-next-line no-await-in-loop
        testPois[i] = await db.poiStore.addPoi(testPois[i]);
      }
    });

    test("create a poi", async () => {
      const newPoi = await db.poiStore.addPoi(testPoi);
      assertSubset(newPoi, testPoi);
    });

    test("delete all pois", async () => {
      let returnedPois = await db.poiStore.getAllPois();
      assert.equal(returnedPois.length, 3);
      await db.poiStore.deleteAll();
      returnedPois = await db.poiStore.getAllPois();
      assert.equal(returnedPois.length, 0);
    });

    test("get a poi - success", async () => {
      const poi = await db.poiStore.addPoi(testPoi);
      const returnedPoi = await db.poiStore.getPoiById(poi._id);
      assert.deepEqual(poi, returnedPoi);
    });

    test("delete One Poi - success", async () => {
      await db.poiStore.deletePoiById(testPois[0]._id);
      const returnedPois = await db.poiStore.getAllPois();
      assert.equal(returnedPois.length, testPois.length - 1);
      const deletedPoi = await db.poiStore.getPoiById(testPois[0]._id);
      assert.isNull(deletedPoi);
    });

    test("update One Poi - success", async () => {
      const testPoiClone = { ...testPois[0] };
      await db.poiStore.updatePoiById(testPois[0]._id, testPoiChanges);
      const updatedPoi = await db.poiStore.getPoiById(testPois[0]._id);
      assertSubset(testPoiChanges, updatedPoi);
      assert.notDeepEqual(updatedPoi, testPoiClone);
    });

    test("get a poi - bad params", async () => {
      assert.isNull(await db.poiStore.getPoiById(""));
      assert.isNull(await db.poiStore.getPoiById());
    });

    test("delete One Poi - fail", async () => {
      await db.poiStore.deletePoiById("bad-id");
      const allPois = await db.poiStore.getAllPois();
      assert.equal(testPois.length, allPois.length);
    });

    test("update One Poi - bad id", async () => {
      const pois = await db.poiStore.getAllPois();
      await db.poiStore.updatePoiById("badId", testPoiChanges);
      assert.deepEqual(pois, await db.poiStore.getAllPois());
    });
  });
}

runTestSuite(() => db.initMem(), "Poi Memory Storage");
runTestSuite(() => db.initJSON(), "Poi Json Storage");
