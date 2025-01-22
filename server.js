import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({path:'./config.env'});
process.on('uncaughtException',(err)=>{
  console.log(err.name,err.message);
  console.log("uncauht exception occured shutting down");
 process.exit(1)
 })
import  app from './app.js';
const port=process.env.PORT_NUMBER;
//handling uncaught rejection

mongoose.connect(process.env.CONN_STRING,{useNewUrlParser:true}).then((conn)=>{
    //  console.log(conn);
      console.log("Connected to MongoDB");
  }).catch((error)=>{
    console.log("some error occur");
  })
//creating a server
const server=app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 });
 process.on('uncaughtRejection',(err)=>{
  console.log(err.name,err.message);
  console.log("uncauht rejectiiooj occuted shutting down");
  server.close(()=>{
    process.exit(1)
  })
 })
 //console.log(rupak);

// // import express from "express";
// // import { connect, Schema, model } from "mongoose";
// // import multer, { memoryStorage } from "multer";
// // import pkg from "body-parser";
// // const {json}=pkg;

// // const app = express();
// // app.use(json());

// // // MongoDB connection
// // connect("mongodb+srv://rupak:rupak2003@cluster0.fcbka.mongodb.net/cineflix", {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });

// // // Define a schema for the image
// //  const fileSchema = new Schema({
// //   name: String,
// //   image: {
// //     data: Buffer,
// //     contentType: String,
// //   },
// //   video: {
// //     data: Buffer,
// //     contentType: String,
// //   },
// //   audio: {
// //     data: Buffer,
// //     contentType: String,
// //   },
// // });

// // const File = model("File", fileSchema);
// // const storage = memoryStorage();
// // const upload = multer({ storage });

// // // Define fields for different file types
// // const uploadFields = upload.fields([
// //   { name: "image", maxCount: 1 },
// //   { name: "video", maxCount: 1 },
// //   { name: "audio", maxCount: 1 },
// // ]);
// // app.post("/upload", uploadFields, async (req, res) => {
// //   try {
// //     const { image, video, audio } = req.files;

// //     const newFile = new File({
// //       name: req.body.name,
// //       image: image
// //         ? {
// //             data: image[0].buffer,
// //             contentType: image[0].mimetype,
// //           }
// //         : undefined,
// //       video: video
// //         ? {
// //             data: video[0].buffer,
// //             contentType: video[0].mimetype,
// //           }
// //         : undefined,
// //       audio: audio
// //         ? {
// //             data: audio[0].buffer,
// //             contentType: audio[0].mimetype,
// //           }
// //         : undefined,
// //     });

// //     await newFile.save();
// //     res.status(200).send("Files uploaded successfully!");
// //   } catch (error) {
// //     res.status(500).send("Error uploading files: " + error.message);
// //   }
// // });
// // app.get("/file/:id/:type", async (req, res) => {
// //   try {
// //     const { id, type } = req.params;

// //     const file = await File.findById(id);
// //     if (!file) {
// //       return res.status(404).send("File not found!");
// //     }

// //     if (!file[type]) {
// //       return res.status(404).send(`${type} not found in this document!`);
// //     }

// //     res.set("Content-Type", file[type].contentType);
// //     res.send(file[type].data);
// //   } catch (error) {
// //     res.status(500).send("Error retrieving file: " + error.message);
// //   }
// // });

// // // Start the server
// // app.listen(3000, () => {
// //   console.log("Server running on http://localhost:3000");
// // });

// // import express from 'express';
// // import multer from 'multer';
// // import axios from 'axios';
// // import { createReadStream, unlinkSync } from 'fs';
// // import FormData from 'form-data'; // Import FormData
// // const app = express();

// // // Configure multer to handle file uploads
// // const upload = multer({
// //   dest: 'uploads/', // Directory where files will be temporarily stored
// // });

// // // POST route to handle facial recognition
// // app.post('/recognize-face', upload.single('image'), async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: 'No image file uploaded' });
// //     }
// //     // Read the uploaded file
// //     const filePath = req.file.path;

// //     // Create FormData and append the image file
// //     const formData = new FormData();
// //     formData.append('image', createReadStream(filePath)); // Add file stream

// //     // Send the image file to the facial recognition model
// //     const response = await axios.post('http://61.1.174.144:5000/recognize', formData, {
// //       headers: formData.getHeaders(), // Add FormData headers
// //     });

// //     // Delete the file after sending it to the model
// //     unlinkSync(filePath);

// //     // Process the response from the model
// //     const result = response.data;
// //    // const formattedString = result.string; // String result
// //     const matchedFaces = result.matched_names; // Array of matched faces
// //      if(matchedFaces){
// //     // Return the response to the client
// //     res.status(200).json({
// //       message: 'Recognition successful',
// //     //  formattedString,
// //       matchedFaces 
// //     }); 
// //   }
  
// //     else{
// //        return res.status(404).json({
// //         message:"image not found",
// //         status:false
// //       })
// //     }
  
// //   } catch (error) {
// //     console.error('Error in recognition:', error.message);
// //     res.status(500).json({
// //       message: 'Error in recognition process',
     
// //       error: error.message,
// //     });
// //   }
// // });

// // // Start the server
// // const PORT = 3000;
// // app.listen(PORT, () => {
// //   console.log(`Server is running on http://localhost:${PORT}`);
// // });
// import express from 'express';
// import pkg from 'body-parser';
// const { json } = pkg;
// import axios from 'axios';
// import cors from 'cors';

// const app = express();
// app.use(cors());
// app.use(json());

// // Define the Travel Preferences, QuestionRequest, and ModifyRequest models
// class TravelPreferences {
//   constructor(destination, present_location, start_date, end_date, budget, travel_styles) {
//     this.destination = destination;
//     this.present_location = present_location;
//     this.start_date = new Date(start_date);
//     this.end_date = new Date(end_date);
//     this.budget = budget;
//     this.travel_styles = travel_styles;
//   }
// }

// class QuestionRequest {
//   constructor(question, destination, travel_plan) {
//     this.question = question;
//     this.destination = destination;
//     this.travel_plan = travel_plan;
//   }
// }

// class ModifyRequest {
//   constructor(travel_plan, modifications) {
//     this.travel_plan = travel_plan;
//     this.modifications = modifications;
//   }
// }

// // Travel Agent class to interact with the AI agent (using external API like OpenAI or custom logic)
// class TravelAgent {
//   constructor() {
//     this.agent = {
//       name: 'Comprehensive Travel Assistant',
//       model: 'llama-3.3-70b-versatile', // Just an identifier placeholder
//       tools: ['DuckDuckGo', 'SerpApiTools'],
//       instructions: [
//         'You are a comprehensive travel planning assistant with expertise in all aspects of travel.',
//         'For every recommendation and data point, you MUST provide working source links.',
//         'Your knowledge spans across:',
//         '- Seasonal travel timing and weather patterns',
//         '- Transportation options and booking',
//         '- Accommodation recommendations',
//         '- Day-by-day itinerary planning',
//         '- Local cuisine and restaurant recommendations',
//         '- Practical travel tips and cultural advice',
//         '- Budget estimation and cost breakdown',
//         'Format all responses in markdown with clear headings (##) and bullet points.',
//         'Use [text](url) format for all hyperlinks.',
//         'Verify all links are functional before including them.',
//         'Organize information clearly with appropriate sections based on the query type.',
//       ],
//     };
//   }

//   async generateTravelPlan(preferences) {
//     const prompt = `Act as a Personalized Travel Expert. Design a comprehensive itinerary for a trip to ${preferences.destination} spanning ${Math.floor((preferences.end_date - preferences.start_date) / (1000 * 60 * 60 * 24))} days, starting on ${preferences.start_date} and ending on ${preferences.end_date}.
//     Traveler Preferences:
//     Budget Level: ${preferences.budget}
//     Travel Styles: ${preferences.travel_styles.join(', ')}`;
//     try {
//       const response = await axios.post('http://61.1.174.144:8000', { prompt });
//       return response.data;
//     } catch (err) {
//       console.error('Error generating travel plan:', err);
//       throw new Error('Error generating travel plan');
//     }
//   }

//   async answerQuestion(request, preferences) {
//     const prompt = `Using the context of this travel plan for ${preferences.destination}: ${request.travel_plan} Please answer this specific question: ${request.question}`;
//     try {
//       const response = await axios.post('http://61.1.174.144:8000', { prompt });
//   return response.data;

//     } catch (err) {
//       console.error('Error answering question:', err);
//       throw new Error('Error answering question');
//     }
//   }

//   async modifyPlan(request) {
//     const prompt = `Modify the following travel plan based on the specified changes:
//     Original Travel Plan: ${request.travel_plan}
//     Modifications: ${request.modifications}`;

//     try {
//       const response = await axios.post('http://61.1.174.144:8000', { prompt });
//       return response.data;
//     } catch (err) {
//       console.error('Error modifying plan:', err);
//       throw new Error('Error modifying plan');
//     }
//   }
// }

// // Initialize the TravelAgent
// const travelAgent = new TravelAgent();

// // Routes
// app.get('/', (req, res) => {
//   res.send('Hi');
// });

// app.post('/generate-plan', async (req, res) => {
//   try {
//     const preferences = new TravelPreferences(
//       req.body.destination,
//       req.body.present_location,
//       req.body.start_date,
//       req.body.end_date,
//       req.body.budget,
//       req.body.travel_styles
//     );
//     const travelPlan = await travelAgent.generateTravelPlan(preferences);
//     res.json({ travel_plan: travelPlan });
//   } catch (error) {
//     res.status(500).json({ detail: error.message });
//   }
// });

// app.post('/answer-question', async (req, res) => {
//   try {
//     const requestData = new QuestionRequest(
//       req.body.question,
//       req.body.destination,
//       req.body.travel_plan
//     );
//     const preferences = new TravelPreferences(req.body.destination, '', '', '', '', []);
//     const answer = await travelAgent.answerQuestion(requestData, preferences);
//     res.json({ answer });
//   } catch (error) {
//     res.status(500).json({ detail: error.message });
//   }
// });

// app.post('/modify-plan', async (req, res) => {
//   try {
//     const modifyRequest = new ModifyRequest(req.body.travel_plan, req.body.modifications);
//     const modifiedPlan = await travelAgent.modifyPlan(modifyRequest);
//     res.json({ modified_plan: modifiedPlan });
//   } catch (error) {
//     res.status(500).json({ detail: error.message });
//   }
// });

// // Start the server
// const PORT = 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


