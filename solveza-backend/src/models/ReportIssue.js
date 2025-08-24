import mongoose from "mongoose";
const ReportIssueSchema = new mongoose.Schema({
  issueId: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  description: String,
  status: { type:String, enum:["open","in_progress","resolved"], default:"open" }
},{ timestamps:true });
export default mongoose.model("ReportIssue", ReportIssueSchema);
