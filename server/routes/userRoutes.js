const {Router} = require('express')

const {registerUser, loginUser, getAuthers, getUser, editUser, changeAvatar, sendImageFile} = require('../controllers/userControllers')
const authMiddleware = require('../middleware/authMiddleware')
const router = Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/:id',getUser)
router.get('/',getAuthers)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-user', authMiddleware, editUser)

router.get('/image/:filename',sendImageFile)











module.exports = router