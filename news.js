const express = require('express');
const News = require('../models/News');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const news = await News.find()
      .populate('authorId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: news.length,
      data: { news }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении новостей'
    });
  }
});

router.get('/group/:group', async (req, res) => {
  try {
    const news = await News.find({ targetGroups: req.params.group })
      .populate('authorId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: news.length,
      data: { news }
    });
  } catch (error) {
    console.error('Get group news error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении новостей'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const news = await News.create(req.body);
    await news.populate('authorId', 'name');

    res.status(201).json({
      status: 'success',
      data: { news }
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при создании новости'
    });
  }
});

module.exports = router;