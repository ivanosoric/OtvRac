const express = require('express')
const router = express.Router()
const Klub = require('../models/klub')

router.get('/', async (req, res) => {
  try {
    const klubovi = await Klub.find()

    res.status(200).json({
      status: "OK",
      message: "Dohvaćeni klubovi",
      response: klubovi
    })
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: "Database error",
      response: null
    })
  }
})

router.get('/drzava/:drzava', async (req, res) => {
  try {
    const klubovi = await Klub.find({ Država: req.params.drzava })

    return res.status(200).json({
      status: "OK",
      message: `Dohvaćeni klubovi iz ${req.params.drzava}`,
      response: klubovi
    })
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
      response: null
    })
  }
})

router.get('/grad/:grad', async (req, res) => {
  try {
    const klubovi = await Klub.find({ Grad: req.params.grad })

    
    return res.status(200).json({
      status: "OK",
      message: `Dohvaćeni klubovi iz grada ${req.params.grad}`,
      response: klubovi
    })
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
      response: null
    })
  }
})

router.get('/liga/:liga', async (req, res) => {
  try {
    const klubovi = await Klub.find({ Liga: req.params.liga })

    return res.status(200).json({
      status: "OK",
      message: `Dohvaćeni klubovi iz ${req.params.liga}`,
      response: klubovi
    })
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
      response: null
    })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const klub = await Klub.findById(req.params.id)

    if (!klub) {
      return res.status(404).json({
        status: "ERROR",
        message: "Klub nije pronađen",
        response: null
      })
    }

    res.status(200).json({
      status: "OK",
      message: "Klub dohvaćen",
      response: klub
    })
  } catch (err) {
        if (err && err.name === "CastError") {
            return res.status(400).json({
            status: "ERROR",
            message: "Invalid ID format",
            response: null
            })
        }

        return res.status(500).json({
            status: "ERROR",
            message: "Server error",
            response: null
        })
}
})




router.post('/', async (req, res) => {
  try {
    const created = await Klub.create(req.body)

    return res.status(201).json({
      status: "OK",
      message: "Dodan klub",
      response: created
    })
  } catch (err) {
    
    if (err && err.code === 11000) {
      return res.status(409).json({
        status: "ERROR",
        message: "Klub sa ovim nazivom već postoji",
        response: null
      })
    }

    if (err && err.name === "ValidationError") {
      const details = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({
        status: "ERROR",
        message: "Validation error",
        response: { details }
      })
    }

    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
      response: null
    })
  }
})


router.put('/:id', async (req, res) => {
  try {
    const updated = await Klub.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          
        runValidators: true 
      }
    )

    if (!updated) {
      return res.status(404).json({
        status: "ERROR",
        message: "Klub not found",
        response: null
      })
    }

    return res.status(200).json({
      status: "OK",
      message: "Updated club",
      response: updated
    })
  } catch (err) {
    
    if (err && err.name === "CastError") {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid ID format",
        response: null
      })
    }

    
    if (err && err.code === 11000) {
      return res.status(409).json({
        status: "ERROR",
        message: "Club with this Naziv already exists",
        response: null
      })
    }

   
    if (err && err.name === "ValidationError") {
      const details = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({
        status: "ERROR",
        message: "Validation error",
        response: { details }
      })
    }

    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
      response: null
    })
  }
})



router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Klub.findByIdAndDelete(req.params.id)

    
    if (!deleted) {
      return res.status(404).json({
        status: "Not Found",
        message: "Klub with the provided ID doesn't exist",
        response: null
      })
    }

    
    return res.status(200).json({
      status: "OK",
      message: "Club deleted",
      response: deleted
    })
  } catch (err) {
    
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid ID format",
        response: null
      })
    }

    
    return res.status(500).json({
      status: "ERROR",
      message: "Server error",
      response: null
    })
  }
})



router.all(/.*/, (req, res) => {
  res.status(501).json({
    status: "Not Implemented",
    message: `Method ${req.method} not implemented for requested resource`,
    response: null
  })
})




module.exports = router