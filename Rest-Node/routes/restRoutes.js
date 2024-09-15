import express from 'express'
import {getCodeForPannel,getCodeAsZip} from '../controllers/restControllers.js'

const router=express.Router()

router.get('/getPannel/:id',getCodeForPannel);

router.get('/getAsZip/:id',getCodeAsZip)

export default router