// Tests currently assume that the App is already running at the provided host.
// Automated instantiation of application will be added in future versions.

const {AppClient} = require("uu_appg01_core-appclient");
const {UriBuilder} = require("uu_appg01_core-uri");

const AWID = "11111111111111111111111111111111";

let baseUriBuilder = new UriBuilder();
baseUriBuilder.setGateway("http://localhost:6221");
baseUriBuilder.setVendor("v");
baseUriBuilder.setApp("a");
baseUriBuilder.setSubApp("s");
baseUriBuilder.setTid("00000000000000000000000000000000");
baseUriBuilder.setAwid(AWID);

let baseUri = baseUriBuilder.toUri();

describe("Test the Echo command", () => {
  // Test with AppClient using GET request, parameters will be
  // automatically serialized to query-string.
  test("test the echo method", async () => {
    let cmdUri = UriBuilder.parse(baseUri).setUseCase("echo");
    let result = await AppClient.get(cmdUri, {text: "test"});
    expect(result.data.echoText).toEqual("test");
    expect(result.data.awid).toEqual(AWID);
  });

  // Test using POST request, parameters will be sent in body.
  test("test the echo method using body", async () => {
    let cmdUri = UriBuilder.parse(baseUri).setUseCase("echo");
    let result = await AppClient.post(cmdUri, {text: "test body"});
    expect(result.data.echoText).toEqual("test body");
    expect(result.data.awid).toEqual(AWID);
  });

});
