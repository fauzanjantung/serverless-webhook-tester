import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main() {
  const getAllRecords = async (table) => {
    let params = {
      TableName: table,
    };
    let items = [];
    let data = await dynamoDb.scan(params).promise();
    items = [...items, ...data.Items];
    while (typeof data.LastEvaluatedKey != "undefined") {
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      data = await dynamoDb.scan(params).promise();
      items = [...items, ...data.Items];
    }
    return items;
  };
  const deleteItem = (table, logId) => {
    var params = {
      TableName: table,
      Key: {
        userId: "123",
        logId: logId,
      },
    };

    return new Promise(function (resolve, reject) {
      dynamoDb.delete(params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  const tableName = process.env.tableName;
  // scan and get all items
  const allRecords = await getAllRecords(tableName);

  // delete one by one
  for (const item of allRecords) {
    await deleteItem(tableName, item.logId);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: true }),
  };
}
