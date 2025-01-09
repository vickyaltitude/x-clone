const NotificationModel = require("../models/notification.model");

module.exports.getNotifications = async (req,res) =>{

    try{

        const userId = req.user._id;

        const notifications = await NotificationModel.find({to: userId}).populate({
            path:"from",
            select: "username profileImg"
        })

        if(notifications.length === 0){
            res.status(200).json({message:"Notification fetch success",notificaitons:[]})
        }

        await NotificationModel.updateMany({to: userId},{read: true});

        res.status(200).json({message:"Notification fetch success",notifications})

    }catch(err){
        console.log(`Error in get notifications controller,${err}`);
        res.status(500).json({ error: "Internal server error" });
    }

}

module.exports.deleteNotifications = async (req,res) =>{
    
    try{

        const userId = req.user._id;

        await NotificationModel.deleteMany({to: userId})

        res.status(200).json({message:"Notification deleted successfully"})

    }catch(err){
        console.log(`Error in delete notifications controller,${err}`);
        res.status(500).json({ error: "Internal server error" });
    }

}