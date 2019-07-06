const { expect } = require("chai");
const request = require("supertest");
const { app, client } = require("../server");

var chaiAssertProperty = (res, property, expected) => {
  expect(res.body).to.have.nested.property(property, expected);
};

var assertValidResponse = res => {
  expect(res.body).to.have.property("time");
};
const timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

before(()=>{
  client.FLUSHALL();
});

describe("Invalid API", function() {
  it("should return a 404 on a call to /hello, an invalid endpoint", async () => {
    return request(app)
      .get("/hello")
      .expect(404);
  });

  it("should handle getDeparturesByStop with invalid GET parameter gracefully", async () => {
    return request(app)
      .get("/api/getdeparturesbystop")
      .expect(400, "invalid");
  });
  it("should handle getStop with invalid GET parameter gracefully", async () => {
    return request(app)
      .get("/api/getstop")
      .expect(400, "invalid");
  });
});

describe("getDeparturesByStop", function() {
  it("should result in cache miss on first access", async () => {
    return request(app)
      .get("/api/getdeparturesbystop?stop_id=IU")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", false))
      .expect(res => chaiAssertProperty(res, "rqst.params.stop_id", "IU"));
  });

  it("should result in cache hit on second access", async () => {
    return request(app)
      .get("/api/getdeparturesbystop?stop_id=IU")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", true))
      .expect(res => chaiAssertProperty(res, "rqst.params.stop_id", "IU"));
  });

  it("should result in cache hit on third access", async () => {
    return request(app)
      .get("/api/getdeparturesbystop?stop_id=IU")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", true));
  });

  it("should have a cache miss on first access to new stop", async () => {
    return request(app)
      .get("/api/getdeparturesbystop?stop_id=PAR")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", false));
  });

  it("should contain the same timestamp with a cached response (2s test)", async () => {
    let { body } = await request(app)
      .get("/api/getdeparturesbystop?stop_id=PLAZA")
      .expect(200)
      .expect(res => assertValidResponse(res));
    const original_time = body.time;

    // verifying that after 2s, the original timestamp matches the new timestamp
    // (i.e.) that it's actually a cached response and not new data fetched from the server
    await timeout(2000);

    let { body: newbody } = await request(app)
      .get("/api/getdeparturesbystop?stop_id=PLAZA")
      .expect(200)
      .expect(res => assertValidResponse(res));

    expect(original_time).to.equal(newbody.time);

  }).timeout(5000);
});

describe("getStop", function() {
  it("should result in cache miss on first access", async () => {
    return request(app)
      .get("/api/getstop?stop_id=IU")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", false))
      .expect(res => chaiAssertProperty(res, "rqst.params.stop_id", "IU"));
  });

  it("should result in cache hit on second access", async () => {
    return request(app)
      .get("/api/getstop?stop_id=IU")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", true))
      .expect(res => chaiAssertProperty(res, "stops[0].stop_id", "IU"));
  });

  it("should result in cache hit on third access", async () => {
    return request(app)
      .get("/api/getstop?stop_id=IU")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", true));
  });

  it("should have a cache miss on first access to new stop", async () => {
    return request(app)
      .get("/api/getstop?stop_id=PAR")
      .expect(200)
      .expect(res => assertValidResponse(res))
      .expect(res => chaiAssertProperty(res, "from_cache", false));
  });

  it("should contain the same timestamp with a cached response (2s test)", async () => {
    let { body } = await request(app)
      .get("/api/getstop?stop_id=PLAZA")
      .expect(200)
      .expect(res => assertValidResponse(res));
    const original_time = body.time;

    // verifying that after 2s, the original timestamp matches the new timestamp
    // (i.e.) that it's actually a cached response and not new data fetched from the server
    await timeout(2000);

    let { body: newbody } = await request(app)
      .get("/api/getstop?stop_id=PLAZA")
      .expect(200)
      .expect(res => assertValidResponse(res));

    expect(original_time).to.equal(newbody.time);

  }).timeout(5000);
});

after(() => {
  // flush cache for next run
  client.FLUSHALL();
  client.end(true);
});
