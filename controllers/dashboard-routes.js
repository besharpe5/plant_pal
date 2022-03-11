const router = require('express').Router();
const sequelize = require('../config/connection');
const { Plant, User, Category } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Plant.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'name',
                'sunlight',
                'water',
                'date_water',
                'plant_img'
            ],
            include: [
                // {
                //     model: Category,
                //     attributes: ['name'],

                // },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPlantData => {
            const plants = dbPlantData.map(plant => plant.get({ plain: true }));
            res.render('dashboard', { plants, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Plant.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'name',
                'sunlight',
                'water',
                'date_water',
                'plant_img'
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPlantData => {
            if (!dbPlantData) {
                res.status(404).json({ message: 'No plant found with this id' });
                return;
            }

            const plant = dbPlantData.get({ plain: true });
            res.render('edit-plant-profile', { plant, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.get('/new-profile', (req, res) => {
    res.render('new-plant-profile');
});

router.get('/new-profile/:id', (req, res) => {
    Plant.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
            'id',
            'name',
            'sunlight',
            'water',
            'date_water',
            'plant_img'
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                // {
                //     model: Comment,
                //     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                //     include: {
                //         model: User,
                //         attributes: ['username']
                //     }
                // }
            ]
        })
        .then(dbPlantData => {
            if (!dbPlantData) {
                res.status(404).json({ message: 'No plant found with this id' });
                return;
            }
            res.json(dbPlantData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// router.get('/edit/:id', withAuth, (req, res) => {
//     Post.findOne({
//             where: {
//                 id: req.params.id
//             },
//             attributes: ['id',
//                 'title',
//                 'content',
//                 'created_at'
//             ],
//             include: [{
//                     model: User,
//                     attributes: ['username']
//                 },
//                 {
//                     model: Comment,
//                     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//                     include: {
//                         model: User,
//                         attributes: ['username']
//                     }
//                 }
//             ]
//         })
//         .then(dbPostData => {
//             if (!dbPostData) {
//                 res.status(404).json({ message: 'No post found with this id' });
//                 return;
//             }

//             const post = dbPostData.get({ plain: true });
//             res.render('edit-post', { post, loggedIn: true });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// })

router.get('/new', (req, res) => {
    res.render('new-post');
});

router.get('/create', withAuth, async (req, res) => {
    try{
      const plantData = await Plant.findAll({
        where: {
          user_id: req.session.user_id,
        },
        attributes: ['id', 'name', 'sunlight', 'water', 'date_water', 'plant_img'],
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ]
      });
      const plants = plantData.map(plant => plant.get({ plain: true }));
      res.render('new-plant-profile', {
        plants, 
        loggedIn: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;