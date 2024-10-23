import express from 'express'
import {getCodeForPannel,getCodeAsZip, getZipJavaCode} from '../controllers/restControllers.js'

const router=express.Router()

router.get('/getPannel/:id',getCodeForPannel);

router.get('/getAsZip/:id',getCodeAsZip)

router.get('/getZipJavaCode',getZipJavaCode)

export default router