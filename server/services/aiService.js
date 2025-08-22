const {GoogleGenerativeAI} =require('@google/generative-ai');

class AIService{
    constructor(){
        this.genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model=this.genAI.getGenerativeModel({model:"gemini-1.5-flash"});

    }

async generateNotes(topic,noteType='general'){
    try{
        const prompts={
            general: `Create comprehensive notes about "${topic}". 
        Structure the content with:
        - Introduction/Overview
        - Key Concepts (use bullet points)
        - Important Details
        - Examples or Applications
        - Summary/Conclusion
        
        Make it detailed and well-organized with clear headings.`,
        
        study: `Create detailed study notes for "${topic}". Format as:
        
        # ${topic} - Study Notes
        
        ## Key Definitions
        - [List important terms and definitions]
        
        ## Core Concepts
        - [Main ideas and principles]
        
        ## Important Points
        - [Critical information to remember]
         ## Examples/Applications
        - [Practical examples or use cases]
        
        ## Summary for Review
        - [Quick review points]
        
        Make it suitable for studying and revision.`,
        
        summary: `Create a well-structured summary of "${topic}". Include:
        
        # ${topic} - Summary
        
        ## Overview
        [Brief introduction]
        
        ## Main Points
        - [Key takeaways in bullet points]
        
        ## Important Details
        - [Essential information]
        
        ## Conclusion
        [Final thoughts or implications]
        
        Keep it concise but comprehensive.`,
        
        detailed: `Create comprehensive detailed notes for "${topic}". Structure as:
        
        # ${topic} - Detailed Notes
         ## Background Information
        [Context and background]
        
        ## Core Concepts
        - [Detailed explanations of main ideas]
        
        ## Key Points
        - [Important information with explanations]
        
        ## Examples and Applications
        - [Real-world examples and use cases]
        
        ## Additional Information
        - [Supplementary details]
        
        ## Conclusion
        [Summary and key takeaways]
        
        Make it comprehensive and detailed.`
        }

        const prompt=prompt[noteType]||prompts.general;

        const result=await this.model.generateContent(prompt);
        const response=await result.response;
        const content=response.text();

        return{
            content:content.trim(),
            topic,
            noteType,
            generatedAt:new Date().toISOString()
        };

    }
    catch(error){
        console.error('Gemini API Error',error)
        throw new Error('Failed to generate notes');
    }
}

async generateTitle(topic,noteType){
    try{
       
      const prompt = `Create a concise, descriptive title for ${noteType} notes about "${topic}". 
      Return only a single suitable title, maximum 60 characters, no quotes.`;

      const result=await this.model.generateContent(prompt);
      const response=await result.response;
      return response.text().trim().replace(/['"]/g, '');
    }

    catch(error){
        return `${noteType.charAt(0).toUpperCase() + noteType.slice(1)} Notes: ${topic}`;
    }
}

}
module.exports=new AIService();