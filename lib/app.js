import * as cdk from "@aws-cdk/core";
import * as sst from "@serverless-stack/resources";

export default class App extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create the table
    const table = new sst.Table(this, "Webhook", {
      fields: {
        userId: sst.TableFieldType.STRING,
        logId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "logId" },
    });

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        // Pass in the table name to our API
        environment: {
          tableName: table.dynamodbTable.tableName,
        },
      },
      routes: {
        "GET    /webhook": "src/list.main",
        "POST   /webhook": "src/create.main",
        "DELETE /webhook": "src/delete.main",
      },
    });

    // Allow the API to access the table
    api.attachPermissions([table]);

    // Show API endpoint in output
    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.httpApi.apiEndpoint,
    });
  }
}
