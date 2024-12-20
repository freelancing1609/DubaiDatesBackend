const express = require('express')
const router = express.Router()
const User = require('../model/User')
const { isAuthenticated } = require('../middleware/isAuthenticated')
const ErrorHandler = require('../utils/ErrorHandler')
const bcrypt = require('bcryptjs')
const { formattedPermissions ,createStaff,updateStaff,deleteStaff,fetchStaff} = require('../utils/Privilege')
// Register a new staff
router.post('/register', isAuthenticated(['admin'],[createStaff]), async (req, res, next) => {
  const { email, password, permissions } = req.body
  let { name, phoneNumber } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return next(new ErrorHandler('User already exists', 400))
    }
    if(permissions.length==0){
      return next(new ErrorHandler("Staff should have atleast one permissions",400))
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
router.put('/permissions/:id',isAuthenticated(['admin'],[updateStaff]),async (req, res, next)=>{
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
router.delete('/:id', isAuthenticated(['admin'],[deleteStaff]), async (req, res, next) => {
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
router.get('/staffs', isAuthenticated(['admin'],[createStaff,updateStaff,deleteStaff]), async (req, res, next) => {
  const staffs = await User.find({ roles: 'staff' })
  return res.status(200).json({ success: true, staffs })
})
router.get('/permission',isAuthenticated(['staff']),async(req, res, next)=>{
let permissions=req.user.permissions
  if(req.user.roles[0]==="admin"){
    permissions="ALL"
  }
  return res.status(200).json({success:true,permission:permissions})
})
module.exports = router
