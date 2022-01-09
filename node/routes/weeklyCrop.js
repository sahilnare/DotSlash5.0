
const router = require('express').Router();
// Importing Models
let Weekly = require('../models/weeklycrop.model');


// Add Crop
router.post("/addcrop", async (req, res) => {
  try {
    const { username, cropName, height, weekNum, points, imagePath } = req.body;

    const newCrop = await Weekly.findOneAndUpdate(
      { username: username, cropName: cropName },
      { $push: { heights: {height: height, weekNum: weekNum, points: points, imagePath: imagePath} } },
      { upsert: true, new: true }
    ).exec();

    res.json({request: true});

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// Get Crop
router.post("/getcrop", async (req, res) => {
    try {
      const { username } = req.body;
  
      const crops = await Weekly.find({username: username}).exec();

      if(crops.length === 0) {
        return res.status(401).json("No data found");
      }
  
      res.json({heights: crops[0].heights});
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server error");
    }
  });


// Delete Crop
// router.post("/friendreject", verification, async (req, res) => {
//   try {
//     const { requester, recipient } = req.body;

//     const connection = await User.findOneAndDelete({ requester: requester, recipient: recipient }).exec();

//     const updateRequester = await User.findOneAndUpdate(
//       { _id: requester },
//       {
//         $pull: { pending: recipient }
//       }
//     ).exec();

//     const updaterecipient = await User.findOneAndUpdate(
//       { _id: recipient },
//       {
//         $pull: { requests: requester }
//       }
//     ).exec();

//     res.json({reject: true});

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json("Server error");
//   }
// });


module.exports = router;
