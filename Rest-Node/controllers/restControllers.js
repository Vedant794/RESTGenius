import {getPannelCode} from '../services/getPannelCode.js'
import {getZipFile} from '../services/getZipFile.js'

export const getCodeForPannel=async(req,res)=>{
    try {
        await getPannelCode(req,res)
    } catch (error) {
        console.error(error)
        res.status(500).send('Unable to fetch getPannelCode due to some reason')
    }
}

export const getCodeAsZip=async(req,res)=>{
    try {
        await getZipFile(req,res)
    } catch (error) {
        console.error(error);
        res.status(500).send('Something Went Wrong please try later..')
    }
}

