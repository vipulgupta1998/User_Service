const express = require('express');
const router = express.Router();
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
//const Book = require("../models/book")
//const fetchUser = require("../middleware/fetchUser")

/********************************* Get user information ***************************/

router.get("/userDetails",async (req, res) => {
    try {
      const userId = req.body.id;
      //const user = await User.findById(userId);
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user data', error });
    }
  });
  
  /********************************* Get all books of user ***************************/

router.get("/userBooks",async(req,res)=>{
  try {
    // const type = req.params.type;
    const userId = req.user.id;
    const user = await User.findById(userId);
    let books = user.BookList;
    res.json(books);
} catch (error) {
  res.status(500).json({ message: 'Error fetching books', error });
}
})

/********************************* Find all the requests ***************************/

// router.get("/allRequests",fetchUser,async(req,res)=>{
//     try {
//         const userId = req.user.id;
  
//         const user = await User.findById(userId)
//           .populate('requestHistory.bookId') 
//           .populate('requestHistory.requestedBy', 'name') 
//           .lean();
    
//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }

//         const incompleteRequests = user.requestHistory.filter(request => !request.completed);
//         const completedRequests = user.requestHistory.filter(request => request.completed);

//         const sortedIncompleteRequests = incompleteRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         const sortedCompletedRequests = completedRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         const sortedRequests = [...sortedIncompleteRequests, ...sortedCompletedRequests];
    
//         res.status(200).json({ requestHistory: sortedRequests });
//       } catch (error) {
//         res.status(500).json({ message: 'Error retrieving request history', error });
//       }
    
// })

router.get("/fetchUser",async(req,res)=>{
   try{
    const token = req.header("auth-token");
    if(!token){
      res.status(401).send({error : "valid token 1 "});
    }
    try {
      const data = jwt.verify(token,JWT_SECRET);
      res.status(200).json({ userId:data.user});
       } catch (error) {
       res.status(401).send({error : "please authenticate using a valid token"});
     }    
   }catch (error) {
  res.status(500).json({ message: 'Error retrieving request history', error });
}
})


//add book
/********************************* Add the books ***************************/

router.post("/addBook",async(req,res)=>{
  try {
      const {bookId ,userId} = req.body;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { BookList: { bookids: bookId } } },
        { new: true } 
    );
  
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
      res.status(201).json({ success : true,message: 'Book added successfully!' });
    } catch (error) {
      res.status(500).json({ success : false,message: 'Error adding book', error });
    }
})


//delete book
/********************************* Delete the book ***************************/

router.delete("/deleteBook",async(req,res)=>{
  try {
    const {bookId ,userId} = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { BookList: { bookids: bookId } } },
      { new: true } 
  ); 

  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }
  
      res.json({ success:true , message: 'Book deleted successfully!' });
    } catch (error) {
      res.status(500).json({ success:false, message: 'Error deleting book', error });
    }
})

module.exports = router;

