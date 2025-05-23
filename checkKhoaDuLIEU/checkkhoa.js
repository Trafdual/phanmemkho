const User = require('../models/UserModel')

const checkKhoaDuLieu = async (req, res, next) => {
  try {
    const userId = req.session.user?._id
    console.log(userId)

    if (!userId) return res.json([])

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.khoadulieu) {
      return res.json([])
    }

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { checkKhoaDuLieu }
