const express = require('express')
const router = express.Router()
const User = require('../model/User')
const { isAuthenticated } = require('../middleware/isAuthenticated')
const ErrorHandler = require('../utils/ErrorHandler')
const bcrypt = require('bcryptjs')
const { formattedPermissions } = require('../utils/Privilege')
// Register a new staff
router.post('/register', isAuthenticated(['admin']), async (req, res, next) => {
  const { email, password, permissions } = req.body
  let { name, phoneNumber } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return next(new ErrorHandler('User already exists', 400))
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    if (!name) {
      name = 'Admin'
    }
    // Save user data
    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      plainPassword: password,
      roles: ['staff'],
      permissions,
    })

    const user = await newUser.save()

    // Generate JWT token
    const token = user.getJwtToken()

    res.status(201).json({ success: true, user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})
router.put('/permissions/:id',isAuthenticated(['admin']),async (req, res, next)=>{
    const {id} = req.params
    const {permissions} = req.body
    try {
        const user = await User.findById(id)
        user.permissions = permissions
        await user.save()
        res.status(200).json({success:true, user})
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error.message})
        }
})
router.delete('/:id', isAuthenticated(['admin']), async (req, res, next) => {
  try {
    const { id} = req.params
    const user = await User.findById(id)
    await User.deleteOne(user);
    if (!user) {    
      return next(new ErrorHandler('User not found', 404))
    }
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})
router.get(
  '/permissions',
  isAuthenticated(['admin']),
  async (req, res, next) => {
    return res.status(200).json({ success: true, formattedPermissions })
  },
)
router.get('/staffs', isAuthenticated(['admin']), async (req, res, next) => {
  const staffs = await User.find({ roles: 'staff' })
  return res.status(200).json({ success: true, staffs })
})
module.exports = router
