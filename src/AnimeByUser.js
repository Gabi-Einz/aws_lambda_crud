const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');

router.get('/users/:id/animes', async (req, res, next) => {
    console.info('get animes by user id');
    const userId = req.params.id;
    const dynamodb = new aws.DynamoDB.DocumentClient();
    let result = {};
    try {
        result = await dynamodb.query({
            TableName: 'AnimeTable',
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            }
          }).promise();
    } catch(error) {
        console.error(error);
    }

    return res.status(200).json(result.Items);
})

module.exports = router;