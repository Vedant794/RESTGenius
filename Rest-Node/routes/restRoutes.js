import express from 'express'
import {getCodeForPannel,getCodeAsZip, getJavaFolders, postFrontend } from '../controllers/restControllers.js'

const router=express.Router()

router.get('/getPannel/:id',getCodeForPannel);

router.get('/getAsZip/:id',getCodeAsZip)

router.get('/getZipJavaCode',getJavaFolders)

router.post('/sendtobackend',postFrontend)


export default router