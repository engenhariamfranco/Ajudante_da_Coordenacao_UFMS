
export interface UfmsCourse {
  code: string;
  name: string;
  semester: number;
  totalHours: number;
  prerequisites: string[];
}

export interface ApprovedCourse {
  originCourse: string;
  ufmsCourse: {
    code: string;
    name: string;
  };
  compatibility: number;
}

export interface RemainingCourse {
  code: string;
  name: string;
  semester: number;
}

export interface AnalysisResult {
  summary: string;
  approvedCourses: ApprovedCourse[];
  remainingMandatoryCourses: RemainingCourse[];
  approvedElectiveHours: number;
  requiredElectiveHours: number;
  estimatedSemesters: number;
  studyPlan?: { semester: number; courses: RemainingCourse[] }[];
}
