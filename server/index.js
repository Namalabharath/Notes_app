require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Notes = require("./models/Notes");

require('./reminderJob');
const app = express();
const PORT = process.env.PORT||8000;

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const remindersRouter = require('./routes/reminders');
app.use('/reminders', remindersRouter);

// AI Routes - inline to avoid import issues
app.post('/api/ai/generate-notes', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    console.log('Received AI request:', req.body); // Debug log
    
    const { topic, noteType = 'general' } = req.body;
    
    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    console.log('Initializing Gemini AI with API key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create comprehensive notes about "${topic}". Include:
    - Introduction/Overview
    - Key Concepts
    - Important Details  
    - Examples
    - Summary
    Make it well-structured and detailed.`;

    console.log('Generating content for topic:', topic); // Debug log

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Generate title
    const titleResult = await model.generateContent(`Create a short title for notes about "${topic}". Max 50 characters.`);
    const titleResponse = await titleResult.response;
    const suggestedTitle = titleResponse.text().trim();

    console.log('Content generated successfully'); // Debug log

    res.json({
      success: true,
      content: content.trim(),
      suggestedTitle: suggestedTitle.replace(/['"]/g, ''),
      topic,
      noteType,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate notes',
      message: error.message
    });
  }
});

// AI Health check
app.get('/api/ai/health', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Test if we can initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    res.json({
      success: true,
      service: 'AI Notes Generator',
      status: 'operational',
      model: 'gemini-1.5-flash',
      apiKeyPresent: !!process.env.GEMINI_API_KEY
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      service: 'AI Notes Generator',
      status: 'error',
      error: error.message
    });
  }
});




// Get All Notes
app.get("/api/notes", async (req, res) => {
  try {
    const data = await Notes.find({});

    if (!data) {
      throw new Error("An error occured while fetching notes.");
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching notes..." });
  }
});

// Get Note by ID
app.get("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const data = await Notes.findById(noteId);

    if (!data) {
      throw new Error("An error occured while fetching notes.");
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching notes..." });
  }
});

// Create A Note - Updated to support AI metadata
app.post("/api/notes", async (req, res) => {
  try {
    const { title, description, isAIGenerated, aiMetadata } = req.body;

    const noteData = { 
      title, 
      description,
      ...(isAIGenerated && { isAIGenerated }),
      ...(aiMetadata && { aiMetadata })
    };

    const data = await Notes.create(noteData);

    if (!data) {
      throw new Error("An error occured while creating a note.");
    }

    res.status(201).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while creating a note..." });
  }
});

// Update A Note
app.put("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, description } = req.body;

    const data = await Notes.findByIdAndUpdate(noteId, { title, description });

    if (!data) {
      throw new Error("An error occured while updating a note.");
    }

    res.status(201).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while updating a note..." });
  }
});

// Delete A Note by ID
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const data = await Notes.findByIdAndDelete(noteId);

    if (!data) {
      throw new Error("An error occured while deleting a note.");
    }

    res.status(201).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while deleting a note..." });
  }
});

app.get("/", (req, res) => {
  res.json("Hello mate!");
});

app.get("*", (req, res) => {
  res.sendStatus("404");
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
