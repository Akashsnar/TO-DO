import mongoose from "mongoose"
var Schema = mongoose.Schema;

const taskschema = mongoose.Schema({
    title: { type: String, required: true },
    starttime: { type: Date },
    endtime: { type: Date },
    priority: { type: Number, default: 1 },
    task_status: { type: Boolean, default: false },
    user:[
        {type: Schema.Types.ObjectId, ref: 'User'}
      ]
}, {
    timestamps: true
})


export const Task= mongoose.model("task", taskschema)


