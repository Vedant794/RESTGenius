import mongoose from 'mongoose'

const connectionSetUp=(URI)=>{
    return mongoose.connect(URI)
}

export default connectionSetUp
