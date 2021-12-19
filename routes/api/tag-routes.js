const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include:[
        { model:Product,  
          required:false // reguired false turns this into a LeftJoin instead of a Join
        },
        ]
     })
    .then(dbTagData => (dbTagData) ? res.json(dbTagData) : res.status(400).json({ message: 'No tags exist' }))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findAll({
    where : {id: req.params.id},
    include:[
        { model:Product,  
          required:false // reguired false turns this into a LeftJoin instead of a Join
        },
        ]
     })
    .then(dbTagData => (dbTagData) ? res.json(dbTagData) : res.status(400).json({ message: `No tags for id ${req.params.id}` }))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(// update category_name by the id given via put, req.body.category_name
    {tag_name: req.body.tag_name},
    )
    .then(dbTagData => {
      //console.log(dbTagData)
      //res.json(dbTagData)
      (!dbTagData) ? res.status(400).json({ message: `Unexpexted result b/c either : invalid id, tag_name "${req.body.tag_name}" is already the tag_name for the id, or  unkown error` }) : res.json(dbTagData) 
      // The DB will return an array with the # of rows affected
      // if DB returns  1 or more rows affected -> then the API return that array with the number
      // else the API probaly retunrned 0 rows affected or an error -> then the api returns an error msg 
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(// update tag_name by the id given via put, req.body.tag_name
    {tag_name: req.body.tag_name},
    {where: {id: req.params.id}}
    )
    .then(dbTagData => {
      (!dbTagData) ? res.status(400).json({ message: `Unexpexted result b/c either : invalid id, tag_name "${req.body.tag_name}" is already the tag_name for the id, or  unkown error` }) : res.json(dbTagData) 
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
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbTagData => {
      (!dbTagData) ? res.status(400).json({ message: `Unexpexted result b/c either : invalid id, tag already deleted for id, or  unkown error` }) : res.json(dbTagData) 
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
