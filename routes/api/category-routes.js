const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include:[
        { model:Product,  
          required:false // reguired false turns this into a LeftJoin instead of a Join
          }
        ]
     })
    .then(dbCategoryData => (dbCategoryData) ? res.json(dbCategoryData) : res.status(400).json({ message: 'No categories exist' }))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findAll({
    where:{id:req.params.id}, // select all where  id in Categories table = id passed from params of get
    include:[
        { model:Product,  
          required:false // reguired false turns this into a LeftJoin instead of a Join
          }
        ]
     })
    .then(dbCategoryData => (Array.isArray(dbCategoryData) && dbCategoryData.length>0) ? res.json(dbCategoryData) : res.status(400).json({ message: 'No categories exist' }))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });

});

router.post('/', (req, res) => {
  // create a new category
   // create a new category
   Category.create({
    category_name: req.body.category_name, // insert new category with category_name from post, req.body.category_name
  }) // if a object with keys is returned from DB -> api returns Object -> else  DB retuend empty object and api returns error
    .then(dbCategoryData => (Object.keys(dbCategoryData).length >0) ? res.json(dbCategoryData) : res.status(400).json({ message: `Something went wrong creating ${req.body.category_name}` }))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(// update category_name by the id given via put, req.body.category_name
    {category_name: req.body.category_name},
    {where: {id: req.params.id}}
    )
    .then(dbCategoryData => {
      (dbCategoryData[0]>=1) ? res.json(dbCategoryData) : res.status(400).json({ message: `Unexpexted result b/c either : invalid id, category_name "${req.body.category_name}" is already the category_name for the id, or  unkown error` })
      // The DB will return an array with the # of rows affected
      // if DB returns  1 or more rows affected -> then the API return that array with the number
      // else the API probaly retunrned 0 rows affected or an error -> then the api returns an error msg 
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });

});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: { // delete a category with a matching id, req.params.id
      id: req.params.id
    }
  })
    .then(dbCategoryData => {
      (dbCategoryData >=1) ? res.json(dbCategoryData) : res.status(400).json({ message: `Unexpexted result b/c either : invalid id, or  unkown error` })
      // The DB will return # of rows affected
      // if DB returns  1 or more rows affected -> then the API return that number 
      // else the API probaly retunrned 0 rows affected or an error -> then the api returns an error msg 

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
