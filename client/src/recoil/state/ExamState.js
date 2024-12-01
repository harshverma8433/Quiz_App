import { atom } from "recoil";

const ExamState = atom({
  key: "exam",
  default: {
    exam_name :"" ,
    exam_duration : "",
    total_question : "",
    total_marks : "",
    passing_marks : ""
  },
});

export default ExamState;
