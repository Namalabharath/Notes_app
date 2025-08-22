const express=require('express')
const router=express.Router();
const aiService=require('../services/aiService');

router.post('/generate-notes', async (req,res)=>{
   try{const {topic,noteType}=req.body;

    if(!topic || !topic.trim()){
        return res.status(400).json({
            success:false,
            error:'Topic is required'
        })
    }

    if(topic.trim().length<2){
        return res.status(400).json({
            success:false,
            error:'Topic must be at least 2 characters long'
        });
    }
    console.log(`generating ${noteType} notes for${topic}`);

    const result=await aiService.generateNotes(topic.trim(),noteType);
    const suggestedTitle=await aiService.generateTitle(topic.trim(),noteType);
    res.json({
        success:true,
        content:result.content,
        suggestedTitle,
        topic:result.topic,
        noteType:result.noteType,
        generatedAt:result.generatedAt
    });
}
catch(error){
console.error('generate notes error',error);
res.status(500).json({
    success:false,
    error:'failed to generate notes',
    message:error.message
});
}
})

module.exports =router;