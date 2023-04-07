const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const { v4 } = require("uuid");
const ANIME_TABLE = 'AnimeTable';

router.post('/anime', async (req, res, next) => {
    const { title, observations, userId } = JSON.parse(req.body);
    const anime = {
        id: v4(),
        userId,
        title,
        observations,
        status: 'pending',
        createdAt: new Date().toString()
    };
    const dynamodb = new aws.DynamoDB.DocumentClient();
    await dynamodb.put({
        TableName: ANIME_TABLE,
        Item: anime

    }).promise();
    return res.status(201).json({
        message: 'anime created sucessfully'
    });

});

router.get('/animes', async (req, res, next) => {
    const dynamodb = new aws.DynamoDB.DocumentClient();
    const result = await dynamodb.scan({
        TableName: ANIME_TABLE
    }).promise();
    return res.status(200).json(result.Items);
})

module.exports = router;