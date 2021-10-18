import { expect, haveResource } from "@aws-cdk/assert";
import * as sst from "@serverless-stack/resources";
import App from "../lib/App";

test("Test Stack", () => {
  const app = new sst.App();
  // WHEN
  const stack = new App(app, "test-stack");
  // THEN
  expect(stack).to(haveResource("AWS::Lambda::Function"));
});
