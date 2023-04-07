const express = require('express');
const router = express.Router();
const aws = require("aws-sdk");
const { v4 } = require("uuid");
const USER_TABLE = 'UserTable'; 

router.post("/user", async (req, res, next) => {

    const dynamodb = new aws.DynamoDB.DocumentClient();
   
    const {name, email} = JSON.parse(req.body);
    const id = v4();
    const user = {
      id,
      name,
      email
    }
    await dynamodb.put({
      TableName: USER_TABLE,
      Item: user
    }).promise();

    return res.status(200).json({
      message: "user created sucessfully",
    });
  });

router.get('/users', async (req, res, next) => {
  const dynamodb = new aws.DynamoDB.DocumentClient();
  const users = await dynamodb.scan({TableName: USER_TABLE}).promise();
  return res.status(200).json(users.Items);
});

router.get('/users/:id', async (req, res, next) => {
  const dynamodb = new aws.DynamoDB.DocumentClient();
  console.log('ID',req.params.id);
  const result = await dynamodb.get({
    TableName: USER_TABLE,
    Key: { id: req.params.id }

  }).promise();
  const user =  result?.Item;
  return res.status(200).json(user);
})

router.delete('/users/:id', async (req, res, next) => {
  const dynamodb = new aws.DynamoDB.DocumentClient();
  const userId = req.params.id;
  await dynamodb.delete({
    TableName: USER_TABLE,
    Key: {
      id: userId
    }
  }).promise();
  return res.status(200).json({
    message: `user deleted sucessfully`
  })
})

router.put('/users/:id', async ( req, res, next) => {
  const dynamodb = new aws.DynamoDB.DocumentClient();
  const userId = req.params.id;
  const {name, email} = JSON.parse(req.body);
  await dynamodb.update({
    TableName: USER_TABLE,
    Key: {
      id: userId
    },
    UpdateExpression: 'set email = :email, #n = :name',
    ExpressionAttributeNames: { '#n': 'name' }, //lo hago de esta forma ya 'name' es una palabra reservada de dynamoDb
    ExpressionAttributeValues: {
      ':email': email,
      ':name': name
    },
    ReturnValues: 'ALL_NEW' 
  }).promise();

  return res.status(200).json({
    message: 'user updated sucessfully'
  });
});

module.exports = router;